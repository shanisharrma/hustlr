import { CreateReviewController, GetReviewController } from '@gateway/controllers/review';
import { authMiddleware } from '@gateway/middlewares/auth-middleware';
import { Router } from 'express';

class ReviewRoutes {
  private router: Router;

  constructor() {
    this.router = Router();
  }

  public routes(): Router {
    this.router.get('/gig/:gigId', authMiddleware.isAuthenticated, GetReviewController.prototype.reviewsByGigId);
    this.router.get(
      '/seller/:sellerId',
      authMiddleware.isAuthenticated,
      GetReviewController.prototype.reviewsBySellerId
    );
    this.router.post('/', authMiddleware.isAuthenticated, CreateReviewController.prototype.review);

    return this.router;
  }
}

export const reviewRoutes: ReviewRoutes = new ReviewRoutes();
