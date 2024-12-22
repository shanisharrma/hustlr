import crypto from 'crypto';

import { Request, Response } from 'express';
import { changePasswordSchema, emailSchema, passwordSchema } from '@auth/schemas/password-schema';
import {
  getAuthUserByEmail,
  getAuthUserByPasswordToken,
  getAuthUserByUsername,
  updatePassword,
  updatePasswordToken
} from '@auth/services/auth-service';
import { BadRequestError, IAuthDocument, IEmailMessageDetails, NotAuthorizedError } from '@shanisharrma/hustlr-shared';
import { serverConfig } from '@auth/config';
import { publishDirectMessage } from '@auth/queues/auth-producer';
import { authChannel } from '@auth/server';
import { StatusCodes } from 'http-status-codes';
import { AuthModel } from '@auth/models/auth-model';

export async function forgotPassword(req: Request, res: Response): Promise<void> {
  const { error } = await Promise.resolve(emailSchema.validate(req.body));
  if (error?.details) {
    throw new BadRequestError(error.details[0].message, 'Password forgotPassword() method error');
  }

  const { email } = req.body;
  const existingUser: IAuthDocument | undefined = await getAuthUserByEmail(email);
  if (!existingUser) {
    throw new BadRequestError('Invalid credentials', 'Password forgotPassword() method error');
  }

  const randomBytes: Buffer = await Promise.resolve(crypto.randomBytes(20));
  const randomCharacters: string = randomBytes.toString('hex');
  const date: Date = new Date();
  date.setHours(date.getHours() + 1);
  await updatePasswordToken(existingUser.id!, randomCharacters, date);
  const resetLink = `${serverConfig.CLIENT_URL}/reset_password?token=${randomCharacters}`;

  const messageDetails: IEmailMessageDetails = {
    receiverEmail: existingUser.email,
    resetLink,
    username: existingUser.username,
    template: 'forgotPassword'
  };

  await publishDirectMessage(
    authChannel,
    'hustlr-email-notification',
    'auth-email',
    JSON.stringify(messageDetails),
    'Forgot password message sent to notification service'
  );
  res.status(StatusCodes.OK).json({ message: 'Password reset email sent.' });
}

export async function resetPassword(req: Request, res: Response): Promise<void> {
  const { error } = await Promise.resolve(passwordSchema.validate(req.body));
  if (error?.details) {
    throw new BadRequestError(error.details[0].message, 'Password resetPassword() method error');
  }

  const { password, confirmPassword } = req.body;
  const { token } = req.params;
  if (password !== confirmPassword) {
    throw new BadRequestError('Reset Password do not match', 'Password resetPassword() method error');
  }

  const isUserExist: IAuthDocument | undefined = await getAuthUserByPasswordToken(token);
  if (!isUserExist) {
    throw new BadRequestError('Reset Password token is invalid.', 'Password resetPassword() method error');
  }

  if (isUserExist && isUserExist.passwordResetExpires && isUserExist.passwordResetExpires < new Date()) {
    throw new BadRequestError('Reset Password token expired.', 'Password resetPassword() method error');
  }

  const hashedPassword: string = await AuthModel.prototype.hashPassword(password);
  await updatePassword(isUserExist.id!, hashedPassword);
  const messageDetails: IEmailMessageDetails = {
    username: isUserExist.username,
    template: 'resetPasswordSuccess'
  };

  await publishDirectMessage(
    authChannel,
    'hustlr-email-notification',
    'auth-email',
    JSON.stringify(messageDetails),
    'Reset password success message sent to notification service'
  );
  res.status(StatusCodes.OK).json({ message: 'Password successfully updated.' });
}

export async function changePassword(req: Request, res: Response): Promise<void> {
  const { error } = await Promise.resolve(changePasswordSchema.validate(req.body));
  if (error?.details) {
    throw new BadRequestError(error.details[0].message, 'Password resetPassword() method error');
  }

  const { currentPassword, newPassword, confirmNewPassword } = req.body;
  if (newPassword !== confirmNewPassword) {
    throw new BadRequestError('Reset Password did not match', 'Password changePassword() method error');
  }

  if (currentPassword === newPassword) {
    throw new BadRequestError(
      'Password matched. Please use different password',
      'Password changePassword() method error'
    );
  }

  const isUserExist: IAuthDocument | undefined = await getAuthUserByUsername(`${req.currentUser?.username}`);
  if (!isUserExist) {
    throw new NotAuthorizedError('Not Authorized', 'Password changePassword() method error');
  }

  const hashedPassword: string = await AuthModel.prototype.hashPassword(newPassword);
  await updatePassword(isUserExist.id!, hashedPassword);
  const messageDetails: IEmailMessageDetails = {
    username: isUserExist.username,
    template: 'resetPasswordSuccess'
  };

  await publishDirectMessage(
    authChannel,
    'hustlr-email-notification',
    'auth-email',
    JSON.stringify(messageDetails),
    'Password Change success message sent to notification service'
  );
  res.status(StatusCodes.OK).json({ message: 'Password successfully updated.' });
}
