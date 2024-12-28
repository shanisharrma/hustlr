import {
  buyerApproveOrder,
  buyerOrders,
  cancel,
  deliverOrder,
  deliveryDate,
  intent,
  order,
  orderId,
  requestExtension,
  sellerOrders
} from '@order/controllers/order';
import express, { Router } from 'express';

const router: Router = express.Router();

export const orderRoutes = (): Router => {
  router.get('/:orderId', orderId);
  router.get('/seller/:sellerId', sellerOrders);
  router.get('/buyer/:buyerId', buyerOrders);

  router.post('/', order);
  router.post('/create-payment-intent', intent);
  router.put('/cancel/:orderId', cancel);
  router.put('/extension/:orderId', requestExtension);
  router.put('/deliver-order/:orderId', deliverOrder);
  router.put('/approve-order/:orderId', buyerApproveOrder);
  router.put('/gig/:type/:orderId', deliveryDate);

  return router;
};
