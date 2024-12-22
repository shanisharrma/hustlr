import { gigById, gigsSearch } from '@auth/services/search-service';
import { IPaginateProps, ISearchResult } from '@shanisharrma/hustlr-shared';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { sortBy } from 'lodash';

export async function gigs(req: Request, res: Response): Promise<void> {
  const { from, size, type } = req.params;
  let resultHits: unknown[] = [];
  const paginate: IPaginateProps = {
    from,
    size: parseInt(`${size}`),
    type
  };

  const gigs: ISearchResult = await gigsSearch(
    `${req.query.query}`,
    paginate,
    `${req.query.delivery_time}`,
    parseInt(`${req.query.min_price}`),
    parseInt(`${req.query.max_price}`)
  );

  for (const gig of gigs.hits) {
    resultHits.push(gig._source);
  }
  if (type === 'backward') {
    resultHits = sortBy(resultHits, ['sortId']);
  }

  res.status(StatusCodes.OK).json({ message: 'Search gigs results', total: gigs.total, gigs: resultHits });
}

export async function singleGigById(req: Request, res: Response): Promise<void> {
  const gig = await gigById('gigs', req.params.gigId);
  res.status(StatusCodes.OK).json({ message: 'Single gig results', gig });
}
