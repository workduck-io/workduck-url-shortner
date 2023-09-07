import type { AWS } from '@serverless/typescript';
import prodStageTable from 'infra/dynamodb/prod-stage-table';
import stagingStageTable from 'infra/dynamodb/staging-stage-table';
import testStageTable from 'infra/dynamodb/test-stage-table';
import localTable from './infra/dynamodb/local-table';
import {
  del,
  navigate,
  shorten,
  shortenMultiple,
  stats,
  workspaceDetails,
} from './src/lambdas';

const serverlessConfiguration: AWS = {
  service: 'mex-url-shortner',
  frameworkVersion: '3',
  plugins: [
    'serverless-dynamodb-local',
    'serverless-esbuild',
    'serverless-offline',
    'serverless-domain-manager',
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs18.x',
    stage: 'local',
    memorySize: 128,
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      stageEnv: '${self:custom.myStage}',
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
    httpApi: {
      disableDefaultEndpoint: true,
      authorizers: {
        workduckAuthorizer: {
          identitySource: '$request.header.Authorization',
          issuerUrl: {
            'Fn::Join': [
              '',
              [
                'https://cognito-idp.',
                '${aws:region}',
                '.amazonaws.com/',
                '${self:custom.cognitoPoolMaps.${opt:stage, self:provider.stage}}',
              ],
            ],
          },
          audience: [
            '${self:custom.cognitoClientIDMaps.${opt:stage, self:provider.stage}}',
          ],
        },
      },
      cors: {
        allowedOrigins: ['*'],
        allowedHeaders: [
          'Content-Type',
          'X-Amz-Date',
          'Authorization',
          'X-Api-Key',
          'X-Amz-Security-Token',
          'X-Amz-User-Agent',
          'X-Amzn-Trace-Id',
          'mex-workspace-id',
          'wd-request-id',
          'mex-api-ver',
        ],
      },
    },
    iam: {
      role: {
        statements: [
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
            Resource:
              'arn:aws:dynamodb:us-east-1:418506370286:table/url-store-*',
          },
        ],
      },
    },
  },
  // import the function via paths
  functions: {
    shorten,
    navigate,
    stats,
    workspaceDetails,
    del,
    shortenMultiple,
  },
  useDotenv: true,
  package: { individually: true },
  custom: {
    'serverless-offline': {
      httpPort: 4000,
      noAuth: true,
      ignoreJWTSignature: true,
    },
    domainMaps: {
      staging: 'url.workduck.io',
      test: 'url-test.workduck.io',
      local: 'localhost:4000',
    },
    cognitoPoolMaps: {
      dev: 'us-east-1_Zu7FAh7hj',
      staging: 'us-east-1_Zu7FAh7hj',
      test: 'us-east-1_O5YTlVrCd',
      local: 'us-east-1_O5YTlVrCd',
    },
    cognitoClientIDMaps: {
      dev: '6pvqt64p0l2kqkk2qafgdh13qe',
      staging: '6pvqt64p0l2kqkk2qafgdh13qe',
      test: '25qd6eq6vv3906osgv8v3f8c6v',
      local: '25qd6eq6vv3906osgv8v3f8c6v',
    },

    customDomain: {
      http: {
        domainName:
          '${self:custom.domainMaps.${opt:stage, self:provider.stage}}',
        basePath: 'link',
        stage: '${opt:stage, self:provider.stage}',
        createRoute53Record: true,
        endpointType: 'regional',
        apiType: 'http',
      },
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
      stages: ['local', 'dev'],
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
  resources: {
    Conditions: {
      IsProd: {
        'Fn::Equals': ["${opt:stage, 'local'}", 'prod'],
      },
      IsTest: {
        'Fn::Equals': ["${opt:stage, 'local'}", 'test'],
      },
      IsStaging: {
        'Fn::Equals': ["${opt:stage, 'local'}", 'staging'],
      },
      IsLocal: {
        'Fn::Equals': ["${opt:stage, 'local'}", 'local'],
      },
    },
    Resources: {
      ...testStageTable,
      ...prodStageTable,
      ...stagingStageTable,
      ...localTable,
    },
  },
};

module.exports = serverlessConfiguration;
