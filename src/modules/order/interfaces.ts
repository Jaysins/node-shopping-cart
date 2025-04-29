import { Document, Types } from 'mongoose';

export interface IOrderItem {
  productId: Types.ObjectId;
  quantity: number;
  purchasedVersion: number;
  priceAtPurchase: number;
}

export interface IOrderDocument extends Document {
  sessionId: string;
  items: IOrderItem[];
  totalAmount: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOrderDTO {
  sessionId: string;
  items: IOrderItem[];
  totalAmount: number;
}