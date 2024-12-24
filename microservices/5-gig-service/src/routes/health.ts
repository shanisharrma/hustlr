import { health } from '@gig/controllers';
import express, { Router } from 'express';

const router: Router = express.Router();

export function healthRoutes(): Router {
  router.get('/gig-health', health);
  return router;
}
