import type { AWS } from '@serverless/typescript';
import Table from 'infra/dynamodb/single-table';
import { navigate, shorten } from 'src/lambdas';

const serverlessConfiguration: AWS = {
  service: 'mex-integration',
  frameworkVersion: '2',
  plugins: [
    'serverless-dynamodb-local',
    'serverless-esbuild',
    'serverless-offline',
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    stage: 'local',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      stageEnv: '${self:custom.myStage}',
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
    lambdaHashingVersion: '20201221',
    httpApi: {
      cors: true,
    },
    iam: {
      role: {
        statements: [
          // {
          //   Effect: 'Allow',
          //   Action: ['lambda:InvokeFunction'],
          //   Resource: ['*'],
          // },
          {
            Effect: 'Allow',
            Action: [
              'dynamodb:Scan',
              'dynamodb:Query',
              'dynamodb:GetItem',
              'dynamodb:PutItem',
              'dynamodb:UpdateItem',
              'dynamodb:DeleteItem',
              'dynamodb:DescribeTable',
              'dynamodb:BatchWriteItem',
              'dynamodb:BatchGetItem',
            ],
            Resource: 'arn:aws:dynamodb:us-east-1:*:*',
          },
        ],
      },
    },
  },
  // import the function via paths
  functions: { shorten, navigate },
  resources: {
    Resources: Table,
  },
  useDotenv: true,
  package: { individually: true },
  custom: {
    'serverless-offline': {
      httpPort: 4000,
    },
    myStage: '${opt:stage, self:provider.stage}',
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    dynamodb: {
      stages: ['local'],
      start: {
        port: 8000,
        convertEmptyValues: true,
        heapInitial: '200m',
        heapMax: '1g',
        migrate: true,
        dbPath: './dbMocks/',
      },
    },
  },
};

module.exports = serverlessConfiguration;
