import { HealthController } from '@gateway/controllers';
import { Router } from 'express';

class HealthRoutes {
  private router: Router;

  constructor() {
    this.router = Router();
  }

  public routes(): Router {
    this.router.get('/gateway-health', HealthController.prototype.health);
    return this.router;
  }
}

export const healthRoutes: HealthRoutes = new HealthRoutes();
