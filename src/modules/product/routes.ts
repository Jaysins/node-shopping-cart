import { Router } from 'express';
import { ProductController } from './controllers';
import { validate } from '../../core/base/schema';
import { createProductSchema, updateProductSchema } from './schema';
import productService from './services';

const productController = new ProductController(productService);

const router = Router();

router.post('/',
  validate(createProductSchema),
  productController.createProduct
);

router.put('/:id',
  validate(updateProductSchema),
  productController.updateProduct
);

router.get('/', productController.listProducts);

router.get('/:id', productController.getProduct);

export default router;