import {
  CreateSellerController,
  GetSellerController,
  SeedSellerController,
  UpdatedSellerController
} from '@gateway/controllers/users';
import { authMiddleware } from '@gateway/middlewares/auth-middleware';
import { Router } from 'express';

class SellerRoutes {
  private router: Router;

  constructor() {
    this.router = Router();
  }

  public routes(): Router {
    this.router.get('/id/:sellerId', authMiddleware.isAuthenticated, GetSellerController.prototype.sellerById);
    this.router.get(
      '/username/:username',
      authMiddleware.isAuthenticated,
      GetSellerController.prototype.sellerByUsername
    );
    this.router.get('/random/:size', authMiddleware.isAuthenticated, GetSellerController.prototype.randomSeller);
    this.router.post('/create', authMiddleware.isAuthenticated, CreateSellerController.prototype.seller);
    this.router.put('/:sellerId', authMiddleware.isAuthenticated, UpdatedSellerController.prototype.seller);
    this.router.put('/seed/:count', authMiddleware.isAuthenticated, SeedSellerController.prototype.seed);

    return this.router;
  }
}

export const sellerRoutes: SellerRoutes = new SellerRoutes();
