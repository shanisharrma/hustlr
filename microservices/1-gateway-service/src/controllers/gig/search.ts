import { gigService } from '@gateway/services/api';
import { AxiosResponse } from 'axios';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export class SearchGigController {
  public async gigs(req: Request, res: Response): Promise<void> {
    const { from, type, size } = req.params;
    let query = '';
    const objList = Object.entries(req.query);
    const lastItemsIndex = objList.length - 1;
    objList.forEach(([key, value], index) => {
      query += `${key}=${value}${index !== lastItemsIndex ? '&' : ''}`;
    });

    const response: AxiosResponse = await gigService.searchGigs(query, from, size, type);
    res
      .status(StatusCodes.OK)
      .json({ message: response.data.message, total: response.data.total, gigs: response.data.gigs });
  }
}
