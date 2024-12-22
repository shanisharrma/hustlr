import { getAuthUserByUsername, signToken } from '@auth/services/auth-service';
import { IAuthDocument } from '@shanisharrma/hustlr-shared';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export async function refreshToken(req: Request, res: Response): Promise<void> {
  const existingUser: IAuthDocument | undefined = await getAuthUserByUsername(req.params.username);
  const userJWT: string = signToken(existingUser!.id!, existingUser!.email!, existingUser!.username!);
  res.status(StatusCodes.OK).json({ message: 'Refresh Token', user: existingUser, token: userJWT });
}
