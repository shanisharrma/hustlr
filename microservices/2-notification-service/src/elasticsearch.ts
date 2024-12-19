import { Client } from '@elastic/elasticsearch';
import { config } from './config';
import { Logger } from 'winston';
import { winstonLogger } from '@shanisharrma/hustlr-shared';
import { ClusterHealthHealthResponseBody } from '@elastic/elasticsearch/lib/api/typesWithBodyKey';

const logger: Logger = winstonLogger(
  `${config.ELASTIC_SEARCH_URL}`,
  'notficationElasticSearchServer',
  'debug'
);

const elasticSearchClient = new Client({
  node: `${config.ELASTIC_SEARCH_URL}`
});

export async function checkConnection(): Promise<void> {
  let isConnected = false;
  while (!isConnected) {
    try {
      const health: ClusterHealthHealthResponseBody =
        await elasticSearchClient.cluster.health({});
      logger.info(
        `NotificationService Elasticsearch health status - ${health.status}`
      );
      isConnected = true;
    } catch (error) {
      logger.error('Connection to Elastic Search failed. Restrying...');
      logger.log(
        'error',
        'NotificationService checkConnection() method:',
        error
      );
    }
  }
}
