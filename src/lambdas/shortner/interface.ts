import { Entity } from 'dynamodb-toolbox';
import { nanoid } from 'nanoid';
import { MyTable } from '../../services/DynamoDB';
import {
  DEFAULT_NAMESPACE,
  DEFAULT_SHORT_URL_LENGTH,
} from '../../utils/consts';
export interface URL {
  namespace?: string;
  short?: string;
  long: string;
  expiry?: number;
  metadata?: any;
}

export interface URLStats {
  namespace: string;
  short: string;
  long: string;
  count: number;
  metadata?: any;
}

export const URLEntity = new Entity<URL>({
  name: 'URL',

  // Define attributes
  attributes: {
    namespace: {
      partitionKey: true,
      default: () => DEFAULT_NAMESPACE,
    },
    short: {
      sortKey: true,
      default: () => nanoid(DEFAULT_SHORT_URL_LENGTH),
      prefix: 'LINK_',
    },
    long: { required: true, type: 'string', map: 'ak' },
    expiry: {
      type: 'number',
      default: () => Date.now() + 1000 * 60 * 60 * 24 * 365,
    },
    metadata: {
      type: 'map',
      default: {},
    },
  },

  // Assign it to our table
  table: MyTable,
});

export const URLStatsEntity = new Entity<URLStats>({
  name: 'URL_STATS',

  // Define attributes
  attributes: {
    namespace: {
      partitionKey: true,
    },
    short: { sortKey: true, prefix: 'STATS_' },
    long: { required: true, type: 'string', map: 'ak' },
    count: {
      type: 'number',
      default: () => 0,
    },
  },

  // Assign it to our table
  table: MyTable,
});
