import {
  CreateGigController,
  DeleteGigController,
  GetGigController,
  SearchGigController,
  SeedGigController,
  UpdateGigController
} from '@gateway/controllers/gig';
import { authMiddleware } from '@gateway/middlewares/auth-middleware';
import { Router } from 'express';

class GigRoutes {
  private router: Router;

  constructor() {
    this.router = Router();
  }

  public routes(): Router {
    this.router.get('/:gigId', authMiddleware.isAuthenticated, GetGigController.prototype.gigById);
    this.router.get('/seller/:sellerId', authMiddleware.isAuthenticated, GetGigController.prototype.sellerGigs);
    this.router.get(
      '/seller/incative/:sellerId',
      authMiddleware.isAuthenticated,
      GetGigController.prototype.sellerInactiveGigs
    );
    this.router.get('/search/:from/:size/:type', authMiddleware.isAuthenticated, SearchGigController.prototype.gigs);
    this.router.get('/category/:username', authMiddleware.isAuthenticated, GetGigController.prototype.gigsByCategory);
    this.router.get('/top/:username', authMiddleware.isAuthenticated, GetGigController.prototype.topRatedGigs);
    this.router.get('/similar/:gigId', authMiddleware.isAuthenticated, GetGigController.prototype.gigsMoreLikeThis);
    this.router.post('/create', authMiddleware.isAuthenticated, CreateGigController.prototype.gig);
    this.router.put('/:gigId', authMiddleware.isAuthenticated, UpdateGigController.prototype.gig);
    this.router.put('/active/:gigId', authMiddleware.isAuthenticated, UpdateGigController.prototype.gigActive);
    this.router.put('/seed/:count', authMiddleware.isAuthenticated, SeedGigController.prototype.seedGig);
    this.router.delete('/:gigId/:sellerId', authMiddleware.isAuthenticated, DeleteGigController.prototype.delete);

    return this.router;
  }
}

export const gigRoutes: GigRoutes = new GigRoutes();
