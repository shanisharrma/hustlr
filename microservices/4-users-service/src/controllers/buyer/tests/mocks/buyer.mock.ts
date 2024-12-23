import { IAuthPayload, IBuyerDocument } from '@shanisharrma/hustlr-shared';
import { Response } from 'express';

export const buyerMockRequest = (sessionData: IJWT, currentUser?: IAuthPayload | null, params?: IParams) => ({
  session: sessionData,
  params,
  currentUser
});

export const buyerMockResponse = (): Response => {
  const res: Response = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

export interface IJWT {
  jwt?: string;
}

export interface IParams {
  username?: string;
}

export const authUserPayload: IAuthPayload = {
  id: 1,
  username: 'Manny',
  email: 'manny1@gmail.com',
  iat: 1235282843
};

export const buyerMockDocument: IBuyerDocument = {
  _id: '4239879832iewufiwhei7ewrhiweh',
  username: 'Manny',
  email: 'manny1@gmail.com',
  country: 'Brazil',
  profilePicture: '',
  isSeller: false,
  purchasedGigs: [],
  createdAt: new Date('2024-12-19T07:48:23.3452')
} as unknown as IBuyerDocument;
