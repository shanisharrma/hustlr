import crypto from 'crypto';

import { messageSchema } from '@chat/schemas/message';
import { BadRequestError, IMessageDocument, uploads } from '@shanisharrma/hustlr-shared';
import { Request, Response } from 'express';
import { UploadApiResponse } from 'cloudinary';
import { addMessage, createConversation } from '@chat/services/message-service';
import { StatusCodes } from 'http-status-codes';

const message = async (req: Request, res: Response): Promise<void> => {
  const { error } = await Promise.resolve(messageSchema.validate(req.body));
  if (error?.details) {
    throw new BadRequestError(error.details[0].message, 'Create message() method');
  }

  let file: string = req.body.file;
  const randomBytes: Buffer = await Promise.resolve(crypto.randomBytes(20));
  const randomCharacters: string = randomBytes.toString('hex');

  if (file) {
    const result: UploadApiResponse =
      req.body.fileType === 'zip'
        ? ((await uploads(file, `${randomCharacters}.zip`)) as UploadApiResponse)
        : ((await uploads(file)) as UploadApiResponse);

    if (!result.public_id) {
      throw new BadRequestError('File upload error. Try again...', 'Create message() method');
    }

    file = result.secure_url;
  }

  const messageData: IMessageDocument = {
    conversationId: req.body.conversationId,
    body: req.body.body,
    file,
    fileType: req.body.fileType,
    fileSize: req.body.fileSize,
    fileName: req.body.fileName,
    gigId: req.body.gigId,
    buyerId: req.body.buyerId,
    sellerId: req.body.sellerId,
    senderUsername: req.body.senderUsername,
    senderPicture: req.body.senderPicture,
    receiverPicture: req.body.receiverPicture,
    receiverUsername: req.body.receiverUsername,
    isRead: req.body.isRead,
    hasOffer: req.body.hasOffer,
    offer: req.body.offer
  };

  if (!req.body.hasConversationId) {
    await createConversation(`${req.body.conversationId}`, req.body.senderUsername, req.body.receiverUsername);
  }

  await addMessage(messageData);

  res
    .status(StatusCodes.CREATED)
    .json({ message: 'Message added', conversationId: req.body.conversationId, messageData });
};

export { message };
