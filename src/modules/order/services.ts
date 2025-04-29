import { OrderModel } from './models';
import { IOrderDocument, CreateOrderDTO } from './interfaces';
import { BaseService } from '../../core/base/service';
import { ClientSession } from 'mongoose';
import productService from '../product/services';
import { ICartDocument } from '../cart/interfaces';

export class OrderService extends BaseService<IOrderDocument> {
  constructor() {
    super(OrderModel);
  }

  async createOrder(
    cart: ICartDocument, 
    options?: { session?: ClientSession }
  ): Promise<IOrderDocument> {
    const orderData: CreateOrderDTO = {
      sessionId: cart.sessionId,
      items: cart.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        purchasedVersion: item.version,
        priceAtPurchase: item.price
      })),
      totalAmount: cart.items.reduce((sum, item) => sum + (item.quantity * item.price), 0)
    };

    return this.model.create([orderData], { session: options?.session }).then(orders => orders[0]);
  }

  async cancelOrder(orderId: string): Promise<IOrderDocument> {
    const session = await this.model.startSession();
    session.startTransaction();

    try {
      const order = await this.model.findByIdAndUpdate(
        orderId,
        { status: 'cancelled' },
        { new: true, session }
      ).exec();

      if (!order) {
        throw new Error('Order not found');
      }

      
      await Promise.all(order.items.map(async (item) => {
        await productService.releaseStock(
          item.productId.toString(),
          item.quantity,
          item.purchasedVersion,
        );
      }));

      await session.commitTransaction();
      return order;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}

const orderService = new OrderService();
export default orderService;