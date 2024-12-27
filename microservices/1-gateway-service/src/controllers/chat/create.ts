import { chatServcie } from '@gateway/services/api';
import { AxiosResponse } from 'axios';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export class CreateMessageController {
  public async message(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await chatServcie.addMessage(req.body);
    res.status(StatusCodes.CREATED).json({
      message: response.data.message,
      conversationId: response.data.conversationId,
      messageData: response.data.messageData
    });
  }
}
