import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { BadRequestError } from '../errors';

export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
      allowUnknown: false
    });

    if (error) {
      const errorMessages = error.details.map((detail: any) => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      return next(new BadRequestError(`Validation failed: `, errorMessages));
    }
    req.body = value;
    next();
  };
};