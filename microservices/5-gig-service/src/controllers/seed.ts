import { publishDirectMessage } from '@gig/queues/gig-producer';
import { gigChannel } from '@gig/server';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const seedGig = async (req: Request, res: Response): Promise<void> => {
  const { count } = req.params;
  await publishDirectMessage(
    gigChannel,
    'hustlr-gig',
    'gig-sellers',
    JSON.stringify({ type: 'get-sellers', count }),
    'Gig seed message sent to user service'
  );
  res.status(StatusCodes.OK).json({ message: 'Gig created successfully.' });
};

export { seedGig };
