import { CreateMessageController, GetMessageController, UpdateMessageController } from '@gateway/controllers/chat';
import { authMiddleware } from '@gateway/middlewares/auth-middleware';
import { Router } from 'express';

class ChatRoutes {
  private router: Router;

  constructor() {
    this.router = Router();
  }

  public routes(): Router {
    this.router.get(
      '/conversation/:senderUsername/:receiverUsername',
      authMiddleware.isAuthenticated,
      GetMessageController.prototype.conversation
    );
    this.router.get(
      '/conversations/:username',
      authMiddleware.isAuthenticated,
      GetMessageController.prototype.conversationList
    );
    this.router.get(
      '/:senderUsername/:receiverUsername',
      authMiddleware.isAuthenticated,
      GetMessageController.prototype.messages
    );
    this.router.get('/:conversationId', authMiddleware.isAuthenticated, GetMessageController.prototype.userMessages);
    this.router.post('/', authMiddleware.isAuthenticated, CreateMessageController.prototype.message);
    this.router.put('/offer', authMiddleware.isAuthenticated, UpdateMessageController.prototype.offer);
    this.router.put(
      '/mark-as-read',
      authMiddleware.isAuthenticated,
      UpdateMessageController.prototype.markSingleMessage
    );
    this.router.put(
      '/mark-multiple-as-read',
      authMiddleware.isAuthenticated,
      UpdateMessageController.prototype.markMultipleMessages
    );

    return this.router;
  }
}

export const chatRoutes: ChatRoutes = new ChatRoutes();
