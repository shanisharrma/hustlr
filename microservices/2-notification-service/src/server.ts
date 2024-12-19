import 'express-async-errors';
import http from 'http';

import { Logger } from 'winston';
import { winstonLogger } from '@shanisharrma/hustlr-shared';
import { Application } from 'express';
import { config } from '@notifications/config';
import { healthRoute } from '@notifications/routes';
import { checkConnection } from '@notifications/elasticsearch';
import { createConnection } from '@notifications/queues/connection';
import {
  consumeAuthEmailMessages,
  consumeOrderEmailMessages
} from '@notifications/queues/email.consumer';
import { Channel } from 'amqplib';

const logger: Logger = winstonLogger(
  `${config.ELASTIC_SEARCH_URL}`,
  'notficationServer',
  'debug'
);

export function start(app: Application): void {
  startServer(app);
  app.use('', healthRoute());
  startQueues();
  startElasticSearch();
}

async function startQueues(): Promise<void> {
  const emailChannel = (await createConnection()) as Channel;
  await consumeAuthEmailMessages(emailChannel);
  await consumeOrderEmailMessages(emailChannel);
}

function startElasticSearch(): void {
  checkConnection();
}

function startServer(app: Application): void {
  try {
    const httpServer: http.Server = new http.Server(app);
    logger.info(
      `Worker with process id of ${process.pid} on notification server has started`
    );
    httpServer.listen(config.SERVER_PORT, () => {
      logger.info(`Notification server running on port ${config.SERVER_PORT}`);
    });
  } catch (error) {
    logger.log('error', 'NotificationService startServer() method:', error);
  }
}
