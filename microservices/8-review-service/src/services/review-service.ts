import { pool } from '@review/config/database.config';
import { publishFanoutMessage } from '@review/queues/order-producer';
import { reviewChannel } from '@review/server';
import { IReviewDocument, IReviewMessageDetails } from '@shanisharrma/hustlr-shared';
// import { map } from 'lodash';
import { QueryResult } from 'pg';

const addReview = async (data: IReviewDocument): Promise<IReviewDocument> => {
  const { gigId, reviewerId, reviewerImage, sellerId, review, rating, orderId, reviewType, reviewerUsername, country } =
    data;
  const createdAtDate = new Date();

  const { rows } = await pool.query(
    `INSERT INTO reviews(gigId,reviewerId,reviewerImage,sellerId,review,rating,orderId,reviewType,reviewerUsername,country,createdAt) 
      VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) 
      RETURNING *`,
    [
      gigId,
      reviewerId,
      reviewerImage,
      sellerId,
      review,
      rating,
      orderId,
      reviewType,
      reviewerUsername,
      country,
      createdAtDate
    ]
  );

  const messageDetails: IReviewMessageDetails = {
    gigId: data.gigId,
    reviewerId: data.reviewerId,
    sellerId: data.sellerId,
    review: data.review,
    rating: data.rating,
    orderId: data.orderId,
    createdAt: `${createdAtDate}`,
    type: `${reviewType}`
  };

  await publishFanoutMessage(
    reviewChannel,
    'hustlr-review',
    JSON.stringify(messageDetails),
    'Review details sent to order and users services'
  );

  return rows[0];
  //   const result: IReviewDocument = Object.fromEntries(
  //     Object.entries(rows[0]).map(([key, value]) => [objKeys[key] || key, value])
  //   );
  //   return result;
};

const getReviwesByGigId = async (gigId: string): Promise<IReviewDocument[]> => {
  const reviews: QueryResult = await pool.query(`SELECT * FROM reviews WHERE reviews.gigId = $1`, [gigId]);
  return reviews.rows;

  //   const mappedResult: IReviewDocument[] = map(reviews.rows, (key) => {
  //     return Object.fromEntries(Object.entries(key).map(([key, value]) => [objKeys[key] || key, value]));
  //   });
  //   return mappedResult;
};

const getReviewsBySellerId = async (sellerId: string): Promise<IReviewDocument[]> => {
  const reviews: QueryResult = await pool.query(
    'SELECT * FROM reviews WHERE reviews.sellerId = $1 AND reviews.reviewType = $2',
    [sellerId, 'seller-review']
  );
  return reviews.rows;

  //   const mappedResult: IReviewDocument[] = map(reviews.rows, (key) => {
  //     return Object.fromEntries(Object.entries(key).map(([key, value]) => [objKeys[key] || key, value]));
  //   });
  //   return mappedResult;
};

export { addReview, getReviwesByGigId, getReviewsBySellerId };
