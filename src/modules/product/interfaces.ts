import { Document, Types } from 'mongoose';

export interface IProductDocument extends Document {
  _id: Types.ObjectId;
  name: string;
  description: string;
  price: number;
  sku: string;
  stock: number;
  version: number;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductDTO {
  name: string;
  description: string;
  price: number;
  sku: string;
  initialStock: number;
  category: string;
}

export interface UpdateProductDTO {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  category?: string;
}
