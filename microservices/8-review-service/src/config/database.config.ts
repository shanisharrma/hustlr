import { winstonLogger } from '@shanisharrma/hustlr-shared';
import { Logger } from 'winston';
import { serverConfig } from '@review/config/server.config';
import { Pool } from 'pg';

const logger: Logger = winstonLogger(`${serverConfig.ELASTIC_SEARCH_URL}`, 'reviewDatabaseServer', 'debug');

const pool: Pool = new Pool({
  host: `${serverConfig.DATABASE_HOST}`,
  user: `${serverConfig.DATABASE_USER}`,
  password: `${serverConfig.DATABASE_PASSWORD}`,
  database: `${serverConfig.DATABASE_NAME}`,
  port: 5432
});

pool.on('error', (error: Error) => {
  logger.log('error', 'pg client error:', error);
  process.exit(1);
});

const createdTableText = `
  CREATE TABLE IF NOT EXISTS public.reviews (
    id SERIAL UNIQUE,
    gigId text NOT NULL,
    reviewerId text NOT NULL,
    orderId text NOT NULL,
    sellerId text NOT NULL,
    review text NOT NULL,
    reviewerImage text NOT NULL,
    reviewerUsername text NOT NULL,
    country text NOT NULL,
    reviewType text NOT NULL,
    rating integer DEFAULT 0 NOT NULL,
    createdAt timestamp DEFAULT CURRENT_DATE,
    PRIMARY KEY (id)
  );

  CREATE INDEX IF NOT EXISTS gigId_idx ON public.reviews (gigId);

  CREATE INDEX IF NOT EXISTS sellerId_idx ON public.reviews (sellerId);
`;

const databaseConnection = async (): Promise<void> => {
  try {
    await pool.connect();
    logger.info('ReviewService successfully connected to PostgreSQL database');
    await pool.query(createdTableText);
  } catch (error) {
    logger.error('ReviewService - Unable to connect to database');
    logger.log('error', 'ReviewService databaseConnection() method error:', error);
  }
};

export { databaseConnection, pool };
