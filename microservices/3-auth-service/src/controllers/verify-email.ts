import { getAuthUserById, getAuthUserByVerificationToken, updateVerifyEmailField } from '@auth/services/auth-service';
import { BadRequestError, IAuthDocument } from '@shanisharrma/hustlr-shared';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export async function update(req: Request, res: Response) {
  const { token } = req.body;
  const isUserExist: IAuthDocument | undefined = await getAuthUserByVerificationToken(token);
  if (!isUserExist) {
    throw new BadRequestError('Verification token is invalid.', 'VerifyEmail update() method error');
  }

  if (isUserExist && isUserExist.emailVerified) {
    throw new BadRequestError('Verification token already used.', 'VerifyEmail update() method error');
  }

  await updateVerifyEmailField(isUserExist.id!, 1, '');
  const updatedUser = await getAuthUserById(isUserExist.id!);
  res.status(StatusCodes.OK).json({ message: 'Email verified Successdully.', user: updatedUser });
}
