import { gigService } from '@gateway/services/api';
import { AxiosResponse } from 'axios';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export class DeleteGigController {
  public async delete(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await gigService.deleteGig(req.params.gigId, req.params.sellerId);
    res.status(StatusCodes.OK).json({ message: response.data.message });
  }
}
