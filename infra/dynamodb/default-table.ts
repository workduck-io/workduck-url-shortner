export default {
  defaultTable: {
    Type: 'AWS::DynamoDB::Table',
    Condition: 'IsSomethingElse',
    Properties: {
      TableName: "url-store-${opt:stage, 'local'}",
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
        ReadCapacityUnits: '1',
        WriteCapacityUnits: '1',
      },
      GlobalSecondaryIndexes: [
        {
          IndexName: 'pk-ak-index',
          KeySchema: [
            {
              AttributeName: 'pk',
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
            ReadCapacityUnits: '1',
            WriteCapacityUnits: '1',
          },
        },
      ],
    },
  },
};
