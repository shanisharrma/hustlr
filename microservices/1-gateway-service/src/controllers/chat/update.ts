import { chatServcie } from '@gateway/services/api';
import { AxiosResponse } from 'axios';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export class UpdateMessageController {
  public async offer(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await chatServcie.updateOffer(req.body.messageId, req.body.type);
    res.status(StatusCodes.CREATED).json({
      message: response.data.message,
      singleMessage: response.data.singleMessage
    });
  }

  public async markMultipleMessages(req: Request, res: Response): Promise<void> {
    const { messageId, senderUsername, receiverUsername } = req.body;
    const response: AxiosResponse = await chatServcie.markMultipleMessagesAsRead(
      messageId,
      senderUsername,
      receiverUsername
    );
    res.status(StatusCodes.CREATED).json({
      message: response.data.message
    });
  }

  public async markSingleMessage(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await chatServcie.markMessageAsRead(req.body.messageId);
    res.status(StatusCodes.CREATED).json({
      message: response.data.message,
      singleMessage: response.data.singleMessage
    });
  }
}
