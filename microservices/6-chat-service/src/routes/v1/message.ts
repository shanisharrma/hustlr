import {
  conversationList,
  conversations,
  markSingleMessage,
  message,
  messages,
  multipleMessages,
  offer,
  userMessages
} from '@chat/controllers';
import express, { Router } from 'express';

const router: Router = express.Router();

const messageRoutes = (): Router => {
  router.get('/conversation/:senderUsername/:receiverUsername', conversations);
  router.get('/conversations/:username', conversationList);
  router.get('/:senderUsername/:receiverUsername', messages);
  router.get('/:conversationId', userMessages);

  router.post('/', message);
  router.put('/offer', offer);
  router.put('/mark-as-red', markSingleMessage);
  router.put('/mark-multiple-as-read', multipleMessages);

  return router;
};

export { messageRoutes };
