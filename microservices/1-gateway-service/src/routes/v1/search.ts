import { SearchController } from '@gateway/controllers/auth';
import { Router } from 'express';

class SearchRoutes {
  private router: Router;

  constructor() {
    this.router = Router();
  }

  public routes(): Router {
    this.router.get('/search/gig/:from/:size/:type', SearchController.prototype.gigs);
    this.router.get('/search/gig/:gigId', SearchController.prototype.gigById);
    return this.router;
  }
}

export const searchRoutes: SearchRoutes = new SearchRoutes();
