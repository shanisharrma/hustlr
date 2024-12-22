import { Application } from 'express';
import { healthRoutes } from '@auth/routes/health';
import { v1Routes } from '@auth/routes/v1';

export function appRoutes(app: Application): void {
  app.use('', healthRoutes());
  app.use('/api', v1Routes());
}
