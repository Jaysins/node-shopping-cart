import { Router } from 'express';
import orderService from './services';
import { OrderController } from './controllers';


const orderController = new OrderController(orderService);

const router = Router();

router.get('/:id', orderController.getOrder);
router.put('/:id/cancel', orderController.cancelOrder);

export default router;