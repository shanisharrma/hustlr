import { gigService } from '@gateway/services/api';
import { AxiosResponse } from 'axios';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export class SeedGigController {
  public async seedGig(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await gigService.seed(req.params.count);
    res.status(StatusCodes.OK).json({ message: response.data.message });
  }
}
