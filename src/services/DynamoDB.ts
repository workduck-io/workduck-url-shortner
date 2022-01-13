import { DynamoDB } from 'aws-sdk';
import { Table } from 'dynamodb-toolbox';
import { getEndpoint, getRegion } from '../utils/consts';

const DocumentClient = new DynamoDB.DocumentClient({
  service: new DynamoDB({
    endpoint: getEndpoint(),
    region: getRegion(),
  }),
});

// Instantiate a table
export const MyTable = new Table({
  // Specify table name (used by DynamoDB)
  name: `url-store-${process.env.stageEnv}`,

  // Define partition and sort keys
  partitionKey: 'pk',
  sortKey: 'sk',
  indexes: {
    'reverse-index': {
      partitionKey: 'sk',
      sortKey: 'ak',
    },
  },

  // Add the DocumentClient
  DocumentClient,
});
