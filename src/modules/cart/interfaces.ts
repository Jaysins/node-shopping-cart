import { Document, Types } from 'mongoose';

export interface ICartItem {
  productId: Types.ObjectId;
  quantity: number;
  version: number;
  price: number;
}

export interface ICartDocument extends Document {
  sessionId: string;
  items: ICartItem[];
  createdAt: Date;
  updatedAt: Date;
}
export interface AddCartItemDTO {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemDTO {
  quantity: number;
}

