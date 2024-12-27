import { winstonLogger } from '@shanisharrma/hustlr-shared';
import { Logger } from 'winston';
import { serverConfig } from '@chat/config/server.config';
import mongoose from 'mongoose';

const logger: Logger = winstonLogger(`${serverConfig.ELASTIC_SEARCH_URL}`, 'chatDatabaseServer', 'debug');

const databaseConnection = async (): Promise<void> => {
  try {
    await mongoose.connect(`${serverConfig.DATABASE_URL}`);
    logger.info('Chat service successfully connected to database');
  } catch (error) {
    logger.log('error', 'ChatService databaseConnection() method error:', error);
  }
};

export { databaseConnection };
