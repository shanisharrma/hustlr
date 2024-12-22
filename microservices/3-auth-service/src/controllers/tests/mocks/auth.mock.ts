import { IAuthDocument, IAuthPayload } from '@shanisharrma/hustlr-shared';
import { Response } from 'express';

export const authMockRequest = (
  sessionData: IJWT,
  body: IAuthMock,
  currentUser?: IAuthPayload | null,
  params?: unknown
) => ({
  session: sessionData,
  body,
  params,
  currentUser
});

export const authMockResponse = (): Response => {
  const res: Response = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

export interface IJWT {
  jwt?: string;
}

export interface IAuthMock {
  id?: number;
  username?: string;
  email?: string;
  password?: string;
  createdAt?: Date | string;
}

export const authUserPayload: IAuthPayload = {
  id: 1,
  username: 'Manny',
  email: 'manny1@gmail.com',
  iat: 1235282843
};

export const authMock: IAuthDocument = {
  id: 1,
  profilePublicId: '1234556439879324',
  username: 'Manny',
  email: 'manny1@gmail.com',
  country: 'Brazil',
  profilePicture: '',
  emailVerified: 1,
  updatedAt: new Date('2024-12-19T07:48:23.3452'),
  comparePassword: () => {},
  hashPassword: () => false
} as unknown as IAuthDocument;
