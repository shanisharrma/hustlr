import { ISellerDocument } from '@shanisharrma/hustlr-shared';
import { getRandomSellers, getSellerById, getSellerByUsername } from '@users/services/seller-service';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const getId = async (req: Request, res: Response): Promise<void> => {
  const seller: ISellerDocument | null = await getSellerById(req.params.id);
  res.status(StatusCodes.OK).json({ message: 'Seller profile', seller });
};

const getUsername = async (req: Request, res: Response): Promise<void> => {
  const seller: ISellerDocument | null = await getSellerByUsername(req.params.username);
  res.status(StatusCodes.OK).json({ message: 'Seller profile', seller });
};

const getRandom = async (req: Request, res: Response): Promise<void> => {
  const sellers: ISellerDocument[] = await getRandomSellers(parseInt(req.params.size));
  res.status(StatusCodes.OK).json({ message: 'Seller profile', sellers });
};

export { getId, getUsername, getRandom };
