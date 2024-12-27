import { chatServcie } from '@gateway/services/api';
import { AxiosResponse } from 'axios';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export class GetMessageController {
  public async conversation(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await chatServcie.getConversation(
      req.params.senderUsername,
      req.params.receiverUsername
    );
    res.status(StatusCodes.CREATED).json({
      message: response.data.message,
      conversations: response.data.conversations
    });
  }

  public async messages(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await chatServcie.getMessages(
      req.params.senderUsername,
      req.params.receiverUsername
    );
    res.status(StatusCodes.CREATED).json({
      message: response.data.message,
      messages: response.data.messages
    });
  }

  public async conversationList(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await chatServcie.getConversationList(req.params.username);
    res.status(StatusCodes.CREATED).json({
      message: response.data.message,
      conversations: response.data.conversations
    });
  }

  public async userMessages(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await chatServcie.getUserMessages(req.params.conversationId);
    res.status(StatusCodes.CREATED).json({
      message: response.data.message,
      messages: response.data.messages
    });
  }
}
