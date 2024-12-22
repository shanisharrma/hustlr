import { CurrentUserController, RefreshTokenController } from '@gateway/controllers';
import { authMiddleware } from '@gateway/middlewares/auth-middleware';
import { Router } from 'express';

class CurrentUserRoutes {
  private router: Router;

  constructor() {
    this.router = Router();
  }

  public routes(): Router {
    this.router.get('/current-user', authMiddleware.isAuthenticated, CurrentUserController.prototype.currentUser);
    this.router.post('/resend-email', authMiddleware.isAuthenticated, CurrentUserController.prototype.resendEmail);
    this.router.get(
      '/refresh-token/:username',
      authMiddleware.isAuthenticated,
      RefreshTokenController.prototype.refreshToken
    );
    return this.router;
  }
}

export const currentUserRoutes: CurrentUserRoutes = new CurrentUserRoutes();
