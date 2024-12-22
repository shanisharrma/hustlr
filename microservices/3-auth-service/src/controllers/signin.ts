import { AuthModel } from '@auth/models/auth-model';
import { loginSchema } from '@auth/schemas/signin-schema';
import { getAuthUserByEmail, getAuthUserByUsername, signToken } from '@auth/services/auth-service';
import { BadRequestError, IAuthDocument, isEmail } from '@shanisharrma/hustlr-shared';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { omit } from 'lodash';

export async function read(req: Request, res: Response): Promise<void> {
  const { error } = await Promise.resolve(loginSchema.validate(req.body));
  if (error?.details) {
    throw new BadRequestError(error.details[0].message, 'Signin read() method error');
  }

  const { username, password } = req.body;
  const isValidEmail: boolean = isEmail(username);
  const existingUser: IAuthDocument | undefined = !isValidEmail
    ? await getAuthUserByUsername(username)
    : await getAuthUserByEmail(username);
  if (!existingUser) {
    throw new BadRequestError('Invalid credentials', 'Signin read() method error');
  }

  const isPasswordMatched: boolean = await AuthModel.prototype.comparePassword(password, `${existingUser.password}`);
  if (!isPasswordMatched) {
    throw new BadRequestError('Invalid credentials', 'Signin read() method error');
  }

  const userJWT: string = signToken(existingUser.id!, existingUser.email!, existingUser.username!);
  const userData: IAuthDocument = omit(existingUser, ['password']);

  res.status(StatusCodes.CREATED).json({ message: 'User logged in successfully', user: userData, token: userJWT });
}
