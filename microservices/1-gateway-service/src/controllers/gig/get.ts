import { gigService } from '@gateway/services/api';
import { AxiosResponse } from 'axios';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export class GetGigController {
  public async gigById(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await gigService.getGigById(req.params.gigId);
    res.status(StatusCodes.OK).json({ message: response.data.message, gig: response.data.gig });
  }

  public async sellerGigs(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await gigService.getSelleGigs(req.params.sellerId);
    res.status(StatusCodes.OK).json({ message: response.data.message, gigs: response.data.gigs });
  }

  public async sellerInactiveGigs(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await gigService.getSellerInactiveGigs(req.params.sellerId);
    res.status(StatusCodes.OK).json({ message: response.data.message, gigs: response.data.gigs });
  }

  public async gigsByCategory(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await gigService.getGigsByCategory(req.params.username);
    res.status(StatusCodes.OK).json({ message: response.data.message, gigs: response.data.gigs });
  }

  public async gigsMoreLikeThis(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await gigService.getMoreGigsLikeThis(req.params.gigId);
    res.status(StatusCodes.OK).json({ message: response.data.message, gigs: response.data.gigs });
  }

  public async topRatedGigs(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await gigService.getTopRatedGigsByCategory(req.params.username);
    res.status(StatusCodes.OK).json({ message: response.data.message, gigs: response.data.gigs });
  }
}
