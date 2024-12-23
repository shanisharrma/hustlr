import { winstonLogger } from '@shanisharrma/hustlr-shared';
import { Logger } from 'winston';
import { serverConfig } from '@users/config/server.config';
import mongoose from 'mongoose';

const logger: Logger = winstonLogger(`${serverConfig.ELASTIC_SEARCH_URL}`, 'usersDatabaseServer', 'debug');

const databaseConnection = async (): Promise<void> => {
  try {
    await mongoose.connect(`${serverConfig.DATABASE_URL}`);
    logger.info('Users service successfully connected to database');
  } catch (error) {
    logger.log('error', 'UsersService databaseConnection() method error:', error);
  }
};

export { databaseConnection };
