import { seedUsers } from '@auth/controllers';
import express, { Router } from 'express';

const router: Router = express.Router();

export function seedRoutes(): Router {
  router.put('/seed/:count', seedUsers);
  return router;
}
