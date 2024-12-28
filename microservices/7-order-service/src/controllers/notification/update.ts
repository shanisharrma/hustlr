import { markNotificationAsRead } from '@order/services/notification-service';
import { IOrderNotifcation } from '@shanisharrma/hustlr-shared';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const markSingleNotificationAsRead = async (req: Request, res: Response): Promise<void> => {
  const { notificatoionId } = req.body;
  const notification: IOrderNotifcation = await markNotificationAsRead(notificatoionId);
  res.status(StatusCodes.OK).json({ message: 'Notification updated successfully', notification });
};

export { markSingleNotificationAsRead };
