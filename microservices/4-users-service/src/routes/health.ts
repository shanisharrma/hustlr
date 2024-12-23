import { health } from '@users/controllers';
import express, { Router } from 'express';

const router: Router = express.Router();

export function healthRoutes(): Router {
  router.get('/user-health', health);
  return router;
}
