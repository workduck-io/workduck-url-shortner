import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import schema from '@resources/models';
import 'source-map-support/register';
import { URL, URLEntity } from './interface';

const URLSchema = schema.definitions.URL;
const shorten: ValidatedEventAPIGatewayProxyEvent<
  typeof URLSchema
> = async event => {
  try {
    const url_data = await URLEntity.update(event.body, {
      returnValues: 'all_new',
    });
    const data = (url_data as any).Attributes as URL;
    return formatJSONResponse({
      message: `https://hb1ew7vhta.execute-api.us-east-1.amazonaws.com/dev/${data.short}`,
    });
  } catch (e) {
    console.error({ e });
    return formatJSONResponse(
      {
        message: e.message,
      },
      500
    );
  }
};

const navigate: ValidatedEventAPIGatewayProxyEvent<undefined> = async event => {
  try {
    const url_data = await URLEntity.get({ short: event.pathParameters.short });
    const data = (url_data as any).Item as URL;
    if (data?.long) {
      if (data.expiry && data.expiry > Date.now())
        return {
          statusCode: 301,
          headers: {
            Location: data.long,
          },
          body: '',
        };
    } else
      return {
        statusCode: 404,
        headers: {
          'Content-Type': 'text/html',
        },
        body: '<html>Link broken or <b>doesnt</b> exist</html>',
      };
  } catch (e) {
    console.error({ e });
    return formatJSONResponse(
      {
        message: e.message,
      },
      500
    );
  }
};

export const shorten_main = middyfy(shorten, URLSchema);
export const navigate_main = middyfy(navigate);
