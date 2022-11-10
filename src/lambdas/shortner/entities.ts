import { Entity } from 'dynamodb-toolbox';
import md5 from 'md5';
import { MyTable } from '../../services/DynamoDB';
import { DEFAULT_NAMESPACE } from '../../utils/consts';

export const URLEntity = new Entity({
  name: 'URL',

  // Define attributes
  attributes: {
    workspace: {
      partitionKey: true,
      default: () => DEFAULT_NAMESPACE,
    },
    urlHash: {
      sortKey: true,
      default: data => md5(data.workspace + data.url),
      prefix: 'LINK_',
      hidden: true,
    },
    alias: { required: true, type: 'string', map: 'ak', coerce: false },
    url: {
      type: 'string',
    },
    expiry: {
      type: 'number',
      default: () => Date.now() + 1000 * 60 * 60 * 24 * 365,
    },
    tags: {
      type: 'set',
      setType: 'string',
    },
    properties: {
      type: 'map',
      required: false,
    },
  },

  // Assign it to our table
  table: MyTable,
});

export const URLStatsEntity = new Entity({
  name: 'URL_STATS',

  // Define attributes
  attributes: {
    workspace: {
      partitionKey: true,
      default: () => DEFAULT_NAMESPACE,
    },
    urlHash: {
      sortKey: true,
      default: data => md5(data.workspace + data.url),
      prefix: 'STATS_',
      hidden: true,
    },
    url: {
      type: 'string',
    },
    count: {
      type: 'number',
      default: () => 0,
    },
    metadata: {
      type: 'map',
    },
  },

  // Assign it to our table
  table: MyTable,
});
