import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import middyJsonBodyParser from '@middy/http-json-body-parser';
import validator from '@middy/validator';

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
      .use(middyJsonBodyParser())
      .use(validator({ inputSchema: awsSchemaGenerator(schema) }))
      .onError(jsonschemaErrors)
      .use(httpErrorHandler());
  else return middy(handler).use(middyJsonBodyParser());
};
