import { CreateOrderController, GetOrderController, UpdateOrderController } from '@gateway/controllers/order';
import { authMiddleware } from '@gateway/middlewares/auth-middleware';
import { Router } from 'express';

class OrderRoutes {
  private router: Router;

  constructor() {
    this.router = Router();
  }

  public routes(): Router {
    this.router.get('/:orderId', authMiddleware.isAuthenticated, GetOrderController.prototype.orderId);
    this.router.get('/seller/:sellerId', authMiddleware.isAuthenticated, GetOrderController.prototype.sellerOrder);
    this.router.get('/buyer/:buyerId', authMiddleware.isAuthenticated, GetOrderController.prototype.buyerOrder);
    this.router.get(
      '/notification/:userTo',
      authMiddleware.isAuthenticated,
      GetOrderController.prototype.notifications
    );

    this.router.post('/', authMiddleware.isAuthenticated, CreateOrderController.prototype.order);
    this.router.post('/create-payment-intent', authMiddleware.isAuthenticated, CreateOrderController.prototype.intent);

    this.router.put(
      '/notification/mark-as-read',
      authMiddleware.isAuthenticated,
      UpdateOrderController.prototype.markNotificationAsRead
    );
    this.router.put('/cancel/:orderId', authMiddleware.isAuthenticated, UpdateOrderController.prototype.cancel);
    this.router.put(
      '/extension/:orderId',
      authMiddleware.isAuthenticated,
      UpdateOrderController.prototype.requestExtension
    );
    this.router.put(
      '/deliver-order/:orderId',
      authMiddleware.isAuthenticated,
      UpdateOrderController.prototype.deliverOrder
    );
    this.router.put(
      '/approve-order/:orderId',
      authMiddleware.isAuthenticated,
      UpdateOrderController.prototype.approveOrder
    );
    this.router.put(
      '/gig/:type/:orderId',
      authMiddleware.isAuthenticated,
      UpdateOrderController.prototype.deliveryDate
    );

    return this.router;
  }
}

export const orderRoutes: OrderRoutes = new OrderRoutes();
