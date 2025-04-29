import { Request, Response } from 'express';
import { BaseController } from '../../core/base/controller';
import { ICartDocument } from './interfaces';
import { AddCartItemDTO } from './interfaces';
import { CartService } from './services';

export class CartController extends BaseController<ICartDocument, CartService> {
  constructor(service: CartService) {
    super(service);
  }

  private getSessionIdFromReq(req: Request): string {
    const sessionId = req.headers['x-session-id'] as string;
    
    if (!sessionId) {
      return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
  }
  return sessionId;
}


  getCart = this.asyncHandler(async (req: Request, res: Response) => {
    const cart = await this.service.getCart(this.getSessionIdFromReq(req));
    this.sendSuccess(res, cart, 'Cart retrieved successfully');
  });

  addItem = this.asyncHandler(async (req: Request, res: Response) => {
    const dto: AddCartItemDTO = {
      productId: req.body.productId,
      quantity: req.body.quantity
    };
    
    const cart = await this.service.addItem(this.getSessionIdFromReq(req), dto);
    this.sendSuccess(res, cart, 'Item added to cart', 201);
  });

  checkout = this.asyncHandler(async (req: Request, res: Response) => {
    this.sendSuccess(res, await this.service.checkout(this.getSessionIdFromReq(req)), 'Checkout successful', 201);
  });

  removeItem = this.asyncHandler(async (req: Request, res: Response) => {
    const productId = req.params.productId;
    const cart = await this.service.removeItem(this.getSessionIdFromReq(req), productId);
    this.sendSuccess(res, cart, 'Item removed from cart');
  });

  clearCart = this.asyncHandler(async (req: Request, res: Response) => {
    await this.service.clearCart(this.getSessionIdFromReq(req));
    this.sendSuccess(res, null, 'Cart cleared successfully');
  });
}