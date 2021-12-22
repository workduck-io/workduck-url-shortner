import { Entity } from 'dynamodb-toolbox';
import { nanoid } from 'nanoid';
import { MyTable } from '../../services/DynamoDB';
import { DEFAULT_SHORT_URL_LENGTH } from '../../utils/consts';
export interface URL {
  short?: string;
  long: string;
  expiry?: number;
}

export const URLEntity = new Entity<URL>({
  name: 'URL',

  // Define attributes
  attributes: {
    short: {
      partitionKey: true,
      default: () => nanoid(DEFAULT_SHORT_URL_LENGTH),
    },
    sk: { hidden: true, sortKey: true, default: data => data.short },
    long: { required: true, type: 'string', map: 'ak' },
    expiry: {
      type: 'number',
      default: () => Date.now() + 1000 * 60 * 60 * 24 * 365,
    },
  },

  // Assign it to our table
  table: MyTable,
});
