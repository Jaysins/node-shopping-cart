import { Router } from 'express';
import { validate } from '../../core/base/schema';
import { CartController } from './controllers';
import cartService from './services';
import { addCartItemSchema } from './schemas';

const cartController = new CartController(cartService);


const router = Router();

router.get('/', cartController.getCart);

router.post(
  '/items',
  validate(addCartItemSchema),
  cartController.addItem
);
router.get(
  '/checkout',
  cartController.checkout
);
router.delete('/items/:productId', 
    cartController.removeItem);

router.delete('/', cartController.clearCart);

export default router;