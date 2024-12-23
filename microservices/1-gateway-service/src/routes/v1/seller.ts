import {
  CreateSellerController,
  GetSellerController,
  SeedSellerController,
  UpdatedSellerController
} from '@gateway/controllers/users';
import { Router } from 'express';

class SellerRoutes {
  private router: Router;

  constructor() {
    this.router = Router();
  }

  public routes(): Router {
    this.router.get('/id/:sellerId', GetSellerController.prototype.sellerById);
    this.router.get('/username/:username', GetSellerController.prototype.sellerByUsername);
    this.router.get('/random/:size', GetSellerController.prototype.randomSeller);
    this.router.post('/create', CreateSellerController.prototype.seller);
    this.router.put('/:sellerId', UpdatedSellerController.prototype.seller);
    this.router.put('/seed/:count', SeedSellerController.prototype.seed);

    return this.router;
  }
}

export const sellerRoutes: SellerRoutes = new SellerRoutes();
