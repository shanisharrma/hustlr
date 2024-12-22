import crypto from 'crypto';

import { getAuthUserByEmail, getAuthUserById, updateVerifyEmailField } from '@auth/services/auth-service';
import { BadRequestError, IAuthDocument, IEmailMessageDetails, lowerCase } from '@shanisharrma/hustlr-shared';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { serverConfig } from '@auth/config';
import { authChannel } from '@auth/server';
import { publishDirectMessage } from '@auth/queues/auth-producer';

export async function currentUser(req: Request, res: Response): Promise<void> {
  let user = null;
  const existingUser: IAuthDocument | undefined = await getAuthUserById(req.currentUser!.id);
  if (existingUser && Object.keys(existingUser).length) {
    user = existingUser;
  }
  res.status(StatusCodes.OK).json({ message: 'Authenticated user', user });
}

export async function resendEmail(req: Request, res: Response): Promise<void> {
  const { email, userId } = req.body;
  const isUserExists: IAuthDocument | undefined = await getAuthUserByEmail(email);
  if (!isUserExists) {
    throw new BadRequestError('Email is invalid.', 'CurrentUser sendEmail() method error');
  }

  const randomBytes: Buffer = await Promise.resolve(crypto.randomBytes(20));
  const randomCharacters: string = randomBytes.toString('hex');

  const verificationLink: string = `${serverConfig.CLIENT_URL}/confirm_email?v_token=${randomCharacters}`;

  await updateVerifyEmailField(userId, 0, randomCharacters);

  const messageDetails: IEmailMessageDetails = {
    receiverEmail: lowerCase(email),
    verifyLink: verificationLink,
    template: 'verifyEmail'
  };

  await publishDirectMessage(
    authChannel,
    'hustlr-email-notification',
    'auth-email',
    JSON.stringify(messageDetails),
    'Verify email message has been sent to notification service.'
  );

  const updatedUser = await getAuthUserById(parseInt(userId));
  res.status(StatusCodes.OK).json({ message: 'Email verification link sent.', user: updatedUser });
}
