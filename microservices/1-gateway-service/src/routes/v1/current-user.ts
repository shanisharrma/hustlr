import { CurrentUserController, RefreshTokenController } from '@gateway/controllers/auth';
import { authMiddleware } from '@gateway/middlewares/auth-middleware';
import { Router } from 'express';

class CurrentUserRoutes {
  private router: Router;

  constructor() {
    this.router = Router();
  }

  public routes(): Router {
    this.router.get('/current-user', authMiddleware.isAuthenticated, CurrentUserController.prototype.currentUser);
    this.router.get(
      '/logged-in-user',
      authMiddleware.isAuthenticated,
      CurrentUserController.prototype.getLoggedInUsers
    );
    this.router.get(
      '/refresh-token/:username',
      authMiddleware.isAuthenticated,
      RefreshTokenController.prototype.refreshToken
    );
    this.router.post('/resend-email', authMiddleware.isAuthenticated, CurrentUserController.prototype.resendEmail);
    this.router.delete(
      '/logged-in-user/:username',
      authMiddleware.isAuthenticated,
      CurrentUserController.prototype.removeLoggedInUsers
    );

    return this.router;
  }
}

export const currentUserRoutes: CurrentUserRoutes = new CurrentUserRoutes();
