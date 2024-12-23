import { createSeller, getId, getRandom, getUsername, seedSeller, updateSeller } from '@users/controllers';
import express, { Router } from 'express';

const router: Router = express.Router();

const sellerRoutes = (): Router => {
  router.get('/id/:sellerId', getId);
  router.get('/username/:username', getUsername);
  router.get('/random/:size', getRandom);
  router.post('/create', createSeller);
  router.put('/:sellerId', updateSeller);
  router.put('/seed/:count', seedSeller);

  return router;
};

export { sellerRoutes };
