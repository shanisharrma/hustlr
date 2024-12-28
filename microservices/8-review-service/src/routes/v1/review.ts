import { review, reviewsByGigId, reviewsBySellerId } from '@review/controllers';
import express, { Router } from 'express';

const router: Router = express.Router();

export const reviewRoutes = (): Router => {
  router.get('/gig/:gigId', reviewsByGigId);
  router.get('/seller/:sellerId', reviewsBySellerId);
  router.post('/', review);
  return router;
};
