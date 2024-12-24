import { winstonLogger } from '@shanisharrma/hustlr-shared';
import { Logger } from 'winston';
import { serverConfig } from '@gig/config/server.config';
import mongoose from 'mongoose';

const logger: Logger = winstonLogger(`${serverConfig.ELASTIC_SEARCH_URL}`, 'gigDatabaseServer', 'debug');

const databaseConnection = async (): Promise<void> => {
  try {
    await mongoose.connect(`${serverConfig.DATABASE_URL}`);
    logger.info('Gig service successfully connected to database');
  } catch (error) {
    logger.log('error', 'GigService databaseConnection() method error:', error);
  }
};

export { databaseConnection };
