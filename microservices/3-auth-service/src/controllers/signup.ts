import crypto from 'crypto';

import { signupSchema } from '@auth/schemas/signup-schema';
import { createAuthUser, getAuthUserByUsernameOrEmail, signToken } from '@auth/services/auth-service';
import {
  BadRequestError,
  capitalize,
  IAuthDocument,
  IEmailMessageDetails,
  lowerCase,
  uploads
} from '@shanisharrma/hustlr-shared';
import { UploadApiResponse } from 'cloudinary';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { serverConfig } from '@auth/config';
import { authChannel } from '@auth/server';
import { publishDirectMessage } from '@auth/queues/auth-producer';
import { StatusCodes } from 'http-status-codes';

export async function create(req: Request, res: Response): Promise<void> {
  const { error } = await Promise.resolve(signupSchema.validate(req.body));
  if (error?.details) {
    throw new BadRequestError(error.details[0].message, 'SignUp create() metthod error');
  }
  const { username, email, password, country, profilePicture } = req.body;
  const isUserExists: IAuthDocument | undefined = await getAuthUserByUsernameOrEmail(username, email);
  if (isUserExists) {
    throw new BadRequestError('Invalid credentials: Email or Username', 'SignUp create() method error');
  }

  const profilePublicId: string = uuidv4();
  const uploadResult: UploadApiResponse = (await uploads(
    profilePicture,
    `${profilePublicId}`,
    true,
    true
  )) as UploadApiResponse;

  if (!uploadResult.public_id) {
    throw new BadRequestError('File upload error. Try again...', 'SignUp create() method error');
  }

  const randomBytes: Buffer = await Promise.resolve(crypto.randomBytes(20));
  const randomCharacters: string = randomBytes.toString('hex');

  const authData: IAuthDocument = {
    username: capitalize(username),
    email: lowerCase(email),
    profilePublicId,
    password,
    country,
    profilePicture: uploadResult.secure_url,
    emailVerficationToken: randomCharacters
  } as IAuthDocument;

  const result: IAuthDocument = await createAuthUser(authData);

  const verificationLink = `${serverConfig.CLIENT_URL}/confirm_email?v_token=${authData.emailVerficationToken}`;
  const messageDetails: IEmailMessageDetails = {
    receiverEmail: result.email,
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

  const userJWT: string = signToken(result.id!, result.email!, result.username!);
  res.status(StatusCodes.CREATED).json({ message: 'Account created successfully', user: result, token: userJWT });
}
