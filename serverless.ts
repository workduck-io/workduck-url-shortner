import type { AWS } from '@serverless/typescript';
import Table from 'infra/dynamodb/single-table';
import hello from 'src/lambdas/hello';

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
      disableDefaultEndpoint: true,
    },
  },
  // import the function via paths
  functions: { hello },
  resources: {
    Resources: Table,
  },
  package: { individually: true },
  custom: {
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
      dbPath: '/dbMocks',
      start: {
        port: 8000,
        inMemory: false,
        seed: true,
        migrate: true,
        convertEmptyValues: true,
      },
    },
  },
};

module.exports = serverlessConfiguration;
