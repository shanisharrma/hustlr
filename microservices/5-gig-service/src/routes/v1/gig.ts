import {
  gigById,
  gigCreate,
  gigDelete,
  gigsByCategory,
  gigUpdate,
  gigUpdateActive,
  moreLikeThis,
  searchGigs,
  seedGig,
  sellerGigs,
  sellerInactiveGigs,
  topRatedGigsByCategory
} from '@gig/controllers';
import express, { Router } from 'express';

const router: Router = express.Router();

const gigRoutes = (): Router => {
  router.get('/:gigId', gigById);
  router.get('/seller/:sellerId', sellerGigs);
  router.get('/seller/incative/:sellerId', sellerInactiveGigs);
  router.get('/search/:from/:size/:type', searchGigs);
  router.get('/category/:username', gigsByCategory);
  router.get('/top/:username', topRatedGigsByCategory);
  router.get('/similar/:gigId', moreLikeThis);
  router.post('/create', gigCreate);
  router.put('/:gigId', gigUpdate);
  router.put('/active/:gigId', gigUpdateActive);
  router.put('/seed/:count', seedGig);
  router.delete('/:gigId/:sellerId', gigDelete);

  return router;
};

export { gigRoutes };
