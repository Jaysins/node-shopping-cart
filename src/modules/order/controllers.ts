import { Request, Response } from 'express';
import { BaseController } from '../../core/base/controller';
import { OrderService } from "./services";
import { IOrderDocument } from './interfaces';

export class OrderController extends BaseController<IOrderDocument, OrderService> {
  constructor(service: OrderService) {
    super(service);
  }

  getOrder = this.asyncHandler(async (req: Request, res: Response) => {
    const orderId = req.params.id;
    const order = await this.service.getById(orderId);
    this.sendSuccess(res, order, 'Order retrieved successfully');
  });

  cancelOrder = this.asyncHandler(async (req: Request, res: Response) => {
    const orderId = req.params.id;
    const order = await this.service.cancelOrder(orderId);
    this.sendSuccess(res, order, 'Order cancelled successfully');
  });
}