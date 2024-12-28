import { markSingleNotificationAsRead, notifications } from '@order/controllers/notification';
import express, { Router } from 'express';

const router: Router = express.Router();

export const notificationRoutes = (): Router => {
  router.get('/:userTo', notifications);
  router.put('/mark-as-read', markSingleNotificationAsRead);

  return router;
};
