import { getByCurrentEmail, getByCurrentUsername, getByUsername } from '@users/controllers';
import express, { Router } from 'express';

const router: Router = express.Router();

const buyerRoutes = (): Router => {
  router.get('/email', getByCurrentEmail);
  router.get('/username', getByCurrentUsername);
  router.get('/:username', getByUsername);

  return router;
};

export { buyerRoutes };
