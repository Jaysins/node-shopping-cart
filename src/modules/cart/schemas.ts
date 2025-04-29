import Joi from 'joi';

export const addCartItemSchema = Joi.object({
  productId: Joi.string().required().hex().length(24),
  quantity: Joi.number().required().min(1).max(100)
});

export const updateCartItemSchema = Joi.object({
  quantity: Joi.number().required().min(0).max(100)
});