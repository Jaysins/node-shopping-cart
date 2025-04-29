import { CartModel } from './models';
import { ICartDocument, AddCartItemDTO } from './interfaces';
import { NotFoundError, ValidationError } from '../../core/errors';
import { BaseService } from '../../core/base/service';
import productService from '../product/services';
import { Types, ClientSession } from 'mongoose';
import orderService from '../order/services';

export class CartService extends BaseService<ICartDocument> {
  constructor() {
    super(CartModel);
  }

  async getOrCreateCart(sessionId: string): Promise<ICartDocument> {
    const cart = await this.model.findOne({ sessionId }).exec() || 
                new this.model({ sessionId, items: [] });
    return cart;
  }

  async getCart(sessionId: string, options?: { session?: ClientSession }): Promise<ICartDocument> {
    const query = this.model.findOne({ sessionId });
    
    if (options?.session) {
        query.session(options.session);
    }

    const cart = await query.exec();
    if (!cart) throw new NotFoundError('Cart not found');
    return cart;
}

  async addItem(sessionId: string, { productId, quantity }: AddCartItemDTO): Promise<ICartDocument> {
    const product = await productService.getById(productId);
    if (!product) throw new ValidationError("Product does not exist");

    const cart = await this.getOrCreateCart(sessionId);
    const productObjectId = new Types.ObjectId(productId);

    const existingItem = cart.items.find(item => 
        item.productId.equals(productObjectId)
    );

    const newQuantity = (existingItem?.quantity || 0) + quantity;

    // Stock check with version validation
    if (product.stock < newQuantity) {
        throw new ValidationError(`Insufficient stock. Available: ${product.stock}`);
    }

    // Atomic remove if quantity reaches zero
    if (newQuantity <= 0) {
        cart.items = cart.items.filter(item => 
            !item.productId.equals(productObjectId)
        );
    } else if (existingItem) {
        // Update existing item with latest version
        existingItem.quantity = newQuantity;
        existingItem.version = product.version;
        existingItem.price = product.price;
    } else {
        // Add new item with current version
        cart.items.push({
            productId: product._id,
            quantity,
            version: product.version,
            price: product.price
        });
    }

    return cart.save();
}

  async removeItem(sessionId: string, productId: string): Promise<ICartDocument> {
    const cart = await this.getCart(sessionId);
    const productObjectId = new Types.ObjectId(productId);
    cart.items = cart.items.filter(item => !item.productId.equals(productObjectId));
    return cart.save();
  }

  async clearCart(sessionId: string, options?: { session?: ClientSession }): Promise<void> {
    await this.model.findOneAndDelete({ sessionId }, options).exec();
  }  

  async checkout(sessionId: string): Promise<void> {
    const cart = await this.getCart(sessionId);
    const reservations: Array<{ productId: string; quantity: number; version: number }> = [];
  
    try {
      // 1. Reserve stock using service method
      await Promise.all(cart.items.map(async (item) => {
        await productService.reserveStock(
          item.productId.toString(),
          item.quantity,
          item.version
        );
        reservations.push({
          productId: item.productId.toString(),
          quantity: item.quantity,
          version: item.version + 1 // Post-reservation version
        });
      }));
  
      // 2. Create order
      await orderService.createOrder(cart);
      
      // 3. Clear cart
      await this.model.deleteOne({ sessionId });
    } catch (error) {
      // 4. Compensate using service method
      await Promise.all(reservations.map(({ productId, quantity, version }) => 
        productService.releaseStock(productId, quantity, version)
      ));
      throw error;
    }
  }
}

const cartService = new CartService()

export default cartService