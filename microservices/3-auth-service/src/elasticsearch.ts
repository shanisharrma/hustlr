import { Client } from '@elastic/elasticsearch';
import { Logger } from 'winston';
import { ISellerGig, winstonLogger } from '@shanisharrma/hustlr-shared';
import { ClusterHealthResponse } from '@elastic/elasticsearch/lib/api/typesWithBodyKey';
import { serverConfig } from '@auth/config';
import { GetResponse } from '@elastic/elasticsearch/lib/api/types';

const logger: Logger = winstonLogger(`${serverConfig.ELASTIC_SEARCH_URL}`, 'authElasticSearchServer', 'debug');

const elasticSearchClient = new Client({
  node: `${serverConfig.ELASTIC_SEARCH_URL}`
});

async function checkConnection(): Promise<void> {
  let isConnected = false;
  while (!isConnected) {
    logger.info('AuthService: Checking connection to Elastic Search...');
    try {
      const health: ClusterHealthResponse = await elasticSearchClient.cluster.health({});
      logger.info(`AuthService Elasticsearch health status - ${health.status}`);
      isConnected = true;
    } catch (error) {
      logger.error('Connection to Elastic Search failed. Restrying...', error);
      logger.log('AuthService checkConnection() method:', error);
    }
  }
}

async function indexExists(indexName: string): Promise<boolean> {
  return await elasticSearchClient.indices.exists({ index: indexName });
}

async function createIndex(indexName: string): Promise<void> {
  try {
    const result: boolean = await indexExists(indexName);
    if (result) {
      logger.info(`Index "${indexName}" already exists.`);
    } else {
      await elasticSearchClient.indices.create({ index: indexName });
      await elasticSearchClient.indices.refresh({ index: indexName });
      logger.info(`Created index ${indexName}`);
    }
  } catch (error) {
    logger.error(`An error occurred while creating the index ${indexName}`);
    logger.log('error', 'AuthService createIndex() method error:', error);
  }
}

async function getDocumentById(index: string, gigId: string): Promise<ISellerGig> {
  try {
    const result: GetResponse = await elasticSearchClient.get({ index, id: gigId });
    return result._source as ISellerGig;
  } catch (error) {
    logger.log('AuthService elasticsearch getDocumentById() method error:', error);
    return {} as ISellerGig;
  }
}

export { elasticSearchClient, checkConnection, createIndex, getDocumentById };
