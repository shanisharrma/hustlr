import { winstonLogger } from '@shanisharrma/hustlr-shared';
import { Logger } from 'winston';
import { serverConfig } from '@order/config/server.config';
import mongoose from 'mongoose';

const logger: Logger = winstonLogger(`${serverConfig.ELASTIC_SEARCH_URL}`, 'orderDatabaseServer', 'debug');

const databaseConnection = async (): Promise<void> => {
  try {
    await mongoose.connect(`${serverConfig.DATABASE_URL}`);
    logger.info('Order service successfully connected to database');
  } catch (error) {
    logger.log('error', 'OrderService databaseConnection() method error:', error);
  }
};

export { databaseConnection };
