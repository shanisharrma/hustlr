import { IBuyerDocument } from '@shanisharrma/hustlr-shared';
import { getBuyerByEmail, getBuyerByUsername } from '@users/services/buyer-service';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const getByCurrentEmail = async (req: Request, res: Response): Promise<void> => {
  const buyer: IBuyerDocument | null = await getBuyerByEmail(req.currentUser!.email);
  res.status(StatusCodes.OK).json({ message: 'Buyer profile', buyer });
};

const getByCurrentUsername = async (req: Request, res: Response): Promise<void> => {
  const buyer: IBuyerDocument | null = await getBuyerByUsername(req.currentUser!.username);
  res.status(StatusCodes.OK).json({ message: 'Buyer profile', buyer });
};

const getByUsername = async (req: Request, res: Response): Promise<void> => {
  const buyer: IBuyerDocument | null = await getBuyerByUsername(req.params.username);
  res.status(StatusCodes.OK).json({ message: 'Buyer profile', buyer });
};

export { getByCurrentEmail, getByCurrentUsername, getByUsername };
