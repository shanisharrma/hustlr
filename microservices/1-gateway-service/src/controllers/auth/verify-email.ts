import { authService } from '@gateway/services/api';
import { AxiosResponse } from 'axios';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export class VerifyEmailController {
  public async update(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await authService.verifyEmail(req.body.token);
    res.status(StatusCodes.OK).json({ message: response.data.message, user: response.data.user });
  }
}
