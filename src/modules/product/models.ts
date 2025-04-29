import mongoose, { Schema } from 'mongoose';
import { IProductDocument } from './interfaces';


const ProductSchema: Schema = new Schema({
  name: { type: String, required: true, index: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  sku: { type: String, required: true, unique: true },
  stock: { type: Number, required: true, min: 0 },
  category: { type: String, required: true, index: true },
  version: { type: Number, default: 0 }

}, {
  timestamps: true,
  versionKey: false 

});



const ProductModel = mongoose.model<IProductDocument>('Product', ProductSchema);
export default ProductModel;