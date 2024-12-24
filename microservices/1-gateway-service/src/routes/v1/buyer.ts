import { GetBuyerController } from '@gateway/controllers/users';
import { authMiddleware } from '@gateway/middlewares/auth-middleware';
import { Router } from 'express';

class BuyerRoutes {
  private router: Router;

  constructor() {
    this.router = Router();
  }

  public routes(): Router {
    this.router.get('/email', authMiddleware.isAuthenticated, GetBuyerController.prototype.getBuyerByCurrentEmail);
    this.router.get(
      '/username',
      authMiddleware.isAuthenticated,
      GetBuyerController.prototype.getBuyerByCurrentUsername
    );
    this.router.get('/:username', authMiddleware.isAuthenticated, GetBuyerController.prototype.getByBuyerUsername);

    return this.router;
  }
}

export const buyerRoutes: BuyerRoutes = new BuyerRoutes();
