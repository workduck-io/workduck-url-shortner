import { Entity } from 'dynamodb-toolbox';
import { MyTable } from '../../services/DynamoDB';

export interface User {
  name: string;
}

export const UserEntity = new Entity<User>({
  name: 'User',

  // Define attributes
  attributes: {
    name: {
      partitionKey: true,
    },
    sk: { hidden: true, sortKey: true, default: data => data.name },
  },

  // Assign it to our table
  table: MyTable,
});
