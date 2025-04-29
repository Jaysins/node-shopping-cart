import { Schema, model } from 'mongoose';
import { IOrderDocument } from './interfaces';

const OrderItemSchema = new Schema({
  productId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  },
  quantity: { 
    type: Number, 
    required: true 
  },
  purchasedVersion: { 
    type: Number, 
    required: true 
  },
  priceAtPurchase: { 
    type: Number, 
    required: true 
  }
});

const OrderSchema = new Schema({
  sessionId: { 
    type: String, 
    required: true,
    index: true
  },
  items: [OrderItemSchema],
  totalAmount: { 
    type: Number, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'completed', 'cancelled'], 
    default: 'pending' 
  }
}, {
  timestamps: true
});

export const OrderModel = model<IOrderDocument>('Order', OrderSchema);