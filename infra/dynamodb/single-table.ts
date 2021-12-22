export default {
  SingleTableDesignDynamoDBTable: {
    Type: 'AWS::DynamoDB::Table',
    Properties: {
      TableName: "datastore-${opt:stage, 'local'}",
      AttributeDefinitions: [
        {
          AttributeName: 'pk',
          AttributeType: 'S',
        },
        {
          AttributeName: 'sk',
          AttributeType: 'S',
        },
        {
          AttributeName: 'ak',
          AttributeType: 'S',
        },
        {
          AttributeName: '_et',
          AttributeType: 'S',
        },
      ],
      KeySchema: [
        {
          AttributeName: 'pk',
          KeyType: 'HASH',
        },
        {
          AttributeName: 'sk',
          KeyType: 'RANGE',
        },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: '15',
        WriteCapacityUnits: '15',
      },
      GlobalSecondaryIndexes: [
        {
          IndexName: 'reverse-index',
          KeySchema: [
            {
              AttributeName: 'sk',
              KeyType: 'HASH',
            },
            {
              AttributeName: 'pk',
              KeyType: 'RANGE',
            },
          ],
          Projection: {
            ProjectionType: 'ALL',
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: '15',
            WriteCapacityUnits: '15',
          },
        },
        {
          IndexName: 'ak-sk-index',
          KeySchema: [
            {
              AttributeName: 'ak',
              KeyType: 'HASH',
            },
            {
              AttributeName: 'sk',
              KeyType: 'RANGE',
            },
          ],
          Projection: {
            ProjectionType: 'ALL',
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: '15',
            WriteCapacityUnits: '15',
          },
        },
        {
          IndexName: '_et-ak-index',
          KeySchema: [
            {
              AttributeName: '_et',
              KeyType: 'HASH',
            },
            {
              AttributeName: 'ak',
              KeyType: 'RANGE',
            },
          ],
          Projection: {
            ProjectionType: 'ALL',
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: '15',
            WriteCapacityUnits: '15',
          },
        },
      ],
    },
  },
};
