import { winstonLogger } from '@shanisharrma/hustlr-shared';
import { Logger } from 'winston';
import { serverConfig } from '@auth/config/server.config';
import { Sequelize } from 'sequelize';

const logger: Logger = winstonLogger(`${serverConfig.ELASTIC_SEARCH_URL}`, 'authDataBaseServer', 'debug');

export const sequelize = new Sequelize(`${serverConfig.MYSQL_DB!}`, {
  dialect: 'mysql',
  logging: false,
  dialectOptions: {
    multipleStatements: true
  }
});

export async function databaseConnection(): Promise<void> {
  try {
    await sequelize.authenticate();
    logger.info('AuthService: MySQL Connection has been established successfully.');
  } catch (error) {
    logger.error('AuthService: Unable to connect to the database:', error);
    logger.log('AuthService databaseConnection() method error:', error);
  }
}
