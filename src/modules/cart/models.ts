import { Schema, model } from 'mongoose';
import { ICartDocument } from './interfaces';

const CartItemSchema = new Schema({
  productId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  },
  quantity: { 
    type: Number, 
    required: true, 
    min: 1 
  },
  version: { 
    type: Number, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true, 
    min: 0 
  }
});

const CartSchema = new Schema({
  sessionId: { 
    type: String, 
    required: true, 
    unique: true ,
    index: true  
  },
  items: [CartItemSchema]
}, {
  timestamps: true
});

const CART_LIFESPAN_SECONDS = 60 * 60 * 24;
CartSchema.index({ updatedAt: 1 }, { expireAfterSeconds: CART_LIFESPAN_SECONDS });


export const CartModel = model<ICartDocument>('Cart', CartSchema);