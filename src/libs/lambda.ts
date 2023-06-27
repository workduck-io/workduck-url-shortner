import middy from '@middy/core';
import httpCors from '@middy/http-cors';
import httpErrorHandler from '@middy/http-error-handler';
import middyJsonBodyParser from '@middy/http-json-body-parser';
import { createError } from '@middy/util';
import validator from '@middy/validator';
import { validate } from '@workduck-io/workspace-validator';

const workduckWorkspaceValidatorMiddleware = () => {
  const workduckWorkspaceValidatorMiddlewareBefore = async request => {
    request.event.headers.Authorization = request.event.headers.authorization;
    try {
      if (process.env.stageEnv !== 'local' && !validate(request.event)) {
        throw new Error('Workspace dont match');
      }
    } catch (cause) {
      const error = createError(401, 'Not authorized to the resource');
      error.cause = cause;
      throw error;
    }
  };

  return {
    before: workduckWorkspaceValidatorMiddlewareBefore,
  };
};

const jsonschemaErrors = handler => {
  if (handler.error.details)
    return {
      statusCode: 400,
      body: JSON.stringify({
        details: handler.error?.details?.map((error: any) => error.params),
        error: handler.error.message,
      }),
    };
  else
    return {
      statusCode: 500,
      body: JSON.stringify({ error: handler.error.message }),
    };
};

const awsSchemaGenerator = (schema: any) => {
  return {
    type: 'object',
    properties: { body: schema },
  } as const;
};

export const middyfy = (handler, schema?) => {
  if (schema)
    return middy(handler)
      .use(httpCors())
      .use(middyJsonBodyParser())
      .use(workduckWorkspaceValidatorMiddleware())
      .use(validator({ inputSchema: awsSchemaGenerator(schema) }))
      .onError(jsonschemaErrors)
      .use(httpErrorHandler());
  else
    return middy(handler)
      .use(httpCors())
      .use(middyJsonBodyParser())
      .use(workduckWorkspaceValidatorMiddleware())
      .use(httpErrorHandler());
};
