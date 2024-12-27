import { Client } from '@elastic/elasticsearch';
import { Logger } from 'winston';
import { ISellerGig, winstonLogger } from '@shanisharrma/hustlr-shared';
import { ClusterHealthResponse } from '@elastic/elasticsearch/lib/api/typesWithBodyKey';
import { serverConfig } from '@gig/config';
import { CountResponse, GetResponse } from '@elastic/elasticsearch/lib/api/types';

const logger: Logger = winstonLogger(`${serverConfig.ELASTIC_SEARCH_URL}`, 'gigElasticSearchServer', 'debug');

const elasticSearchClient = new Client({
  node: `${serverConfig.ELASTIC_SEARCH_URL}`
});

const checkConnection = async (): Promise<void> => {
  let isConnected = false;
  while (!isConnected) {
    logger.info('GigService: Checking connection to Elastic Search...');
    try {
      const health: ClusterHealthResponse = await elasticSearchClient.cluster.health({});
      logger.info(`GigService Elasticsearch health status - ${health.status}`);
      isConnected = true;
    } catch (error) {
      logger.error('Connection to Elastic Search failed. Restrying...', error);
      logger.log('error', 'GigService checkConnection() method:', error);
    }
  }
};

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

const gerDocumentCount = async (index: string): Promise<number> => {
  try {
    const result: CountResponse = await elasticSearchClient.count({ index });
    return result.count;
  } catch (error) {
    logger.log('error', 'GigService elasticsearch getIndexDocument() method error:', error);
    return 0;
  }
};

const getIndexedDocument = async (index: string, itemId: string): Promise<ISellerGig> => {
  try {
    const result: GetResponse = await elasticSearchClient.get({ index, id: itemId });
    return result._source as ISellerGig;
  } catch (error) {
    logger.log('error', 'GigService elasticsearch getIndexDocument() method error:', error);
    return {} as ISellerGig;
  }
};

const addDocumentToIndex = async (index: string, itemId: string, gigDocument: unknown): Promise<void> => {
  try {
    await elasticSearchClient.index({
      index,
      id: itemId,
      document: gigDocument
    });
  } catch (error) {
    logger.log('error', 'GigService elasticsearch addDocumentToIndex() method error:', error);
  }
};

const updateIndexedDocument = async (index: string, itemId: string, gigDocument: unknown): Promise<void> => {
  try {
    await elasticSearchClient.update({
      index,
      id: itemId,
      doc: gigDocument
    });
  } catch (error) {
    logger.log('error', 'GigService elasticsearch updateIndexedDocument() method error:', error);
  }
};

const deleteIndexedDocument = async (index: string, itemId: string): Promise<void> => {
  try {
    await elasticSearchClient.delete({
      index,
      id: itemId
    });
  } catch (error) {
    logger.log('error', 'GigService elasticsearch deleteIndexedDocument() method error:', error);
  }
};

export {
  elasticSearchClient,
  checkConnection,
  createIndex,
  gerDocumentCount,
  getIndexedDocument,
  addDocumentToIndex,
  updateIndexedDocument,
  deleteIndexedDocument
};
