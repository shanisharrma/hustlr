import {
  PasswordController,
  AuthSeedController,
  SigninController,
  SignupController,
  VerifyEmailController
} from '@gateway/controllers';
import { Router } from 'express';

class AuthRoutes {
  private router: Router;

  constructor() {
    this.router = Router();
  }

  public routes(): Router {
    this.router.post('/signup', SignupController.prototype.create);
    this.router.post('/signin', SigninController.prototype.read);
    this.router.put('/verify-email', VerifyEmailController.prototype.update);
    this.router.put('/forgot-password', PasswordController.prototype.forgotPassword);
    this.router.put('/reset-password/:token', PasswordController.prototype.resetPassword);
    this.router.put('/change-password', PasswordController.prototype.changePassword);
    this.router.put('/seed/:count', AuthSeedController.prototype.seedUsers);
    return this.router;
  }
}

export const authRoutes: AuthRoutes = new AuthRoutes();
