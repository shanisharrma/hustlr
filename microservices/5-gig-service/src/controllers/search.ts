import { gigsSearch } from '@gig/services/search-service';
import { IPaginateProps, ISearchResult, ISellerGig } from '@shanisharrma/hustlr-shared';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { sortBy } from 'lodash';

const searchGigs = async (req: Request, res: Response): Promise<void> => {
  const { from, size, type } = req.params;
  let resultHits: ISellerGig[] = [];
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
    resultHits.push(gig._source as ISellerGig);
  }
  if (type === 'backward') {
    resultHits = sortBy(resultHits, ['sortId']);
  }

  res.status(StatusCodes.OK).json({ message: 'Search gigs results', total: gigs.total, gigs: resultHits });
};

export { searchGigs };
