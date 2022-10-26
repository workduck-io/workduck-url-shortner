export default {
  testStageTable: {
    Type: 'AWS::DynamoDB::Table',
    Condition: 'IsTest',
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
        ReadCapacityUnits: '10',
        WriteCapacityUnits: '10',
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
            ReadCapacityUnits: '10',
            WriteCapacityUnits: '10',
          },
        },
      ],
    },
  },
};
