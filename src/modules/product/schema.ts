import Joi from 'joi';
import { IProductDocument } from './interfaces';


export const createProductSchema = Joi.object<IProductDocument>({
  name: Joi.string().required().min(3).max(100),
  description: Joi.string().required().min(10).max(500),
  price: Joi.number().required().min(0).precision(2),
  sku: Joi.string().required(),
  stock: Joi.number().required().min(0).integer(),
  category: Joi.string().required().valid(
    'electronics', 
    'clothing', 
    'books', 
    'home'
  )
});

export const updateProductSchema = Joi.object<IProductDocument>({
  name: Joi.string().min(3).max(100),
  description: Joi.string().min(10).max(500),
  price: Joi.number().min(0).precision(2),
  category: Joi.string().valid(
    'electronics', 
    'clothing', 
    'books', 
    'home'
  )
}).min(1); // At least one field required