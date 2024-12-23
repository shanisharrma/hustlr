import { GetBuyerController } from '@gateway/controllers/users';
import { Router } from 'express';

class BuyerRoutes {
  private router: Router;

  constructor() {
    this.router = Router();
  }

  public routes(): Router {
    this.router.post('/email', GetBuyerController.prototype.getBuyerByCurrentEmail);
    this.router.post('/username', GetBuyerController.prototype.getBuyerByCurrentUsername);
    this.router.post('/:username', GetBuyerController.prototype.getByBuyerUsername);

    return this.router;
  }
}

export const buyerRoutes: BuyerRoutes = new BuyerRoutes();
