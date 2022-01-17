import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import schema from '@resources/models';
import 'source-map-support/register';
import { KEYWORDS } from '../../utils/consts';
import { URL, URLEntity, URLStatsEntity } from './interface';
import {loadingPage} from '../../utils/loader';
const URLSchema = schema.definitions.URL;
const shorten: ValidatedEventAPIGatewayProxyEvent<
  typeof URLSchema
> = async event => {
  try {
    if (
      KEYWORDS.includes(event.body.namespace) ||
      KEYWORDS.includes(event.body.short)
    ) {
      return formatJSONResponse(
        {
          error: 'Invalid namespace or alias',
        },
        500
      );
    }
    const url_data = await URLEntity.update(event.body, {
      returnValues: 'all_new',
      conditions: [
        {
          attr: 'short',
          exists: false,
        },
      ],
    });
    const data = (url_data as any).Attributes as URL;
    return formatJSONResponse({
      message: `https://url.workduck.io/link/${data.namespace}/${data.short}`,
    });
  } catch (e) {
    console.error({ e });
    return formatJSONResponse(
      {
        errorMessage: e.message,
        message: 'URL already exists',
      },
      500
    );
  }
};

const update: ValidatedEventAPIGatewayProxyEvent<
  typeof URLSchema
> = async event => {
  try {
    const url_data = await URLEntity.update(event.body, {
      returnValues: 'all_new',
      conditions: [
        {
          attr: 'short',
          exists: true,
        },
      ],
    });
    const data = (url_data as any).Attributes as URL;
    return formatJSONResponse({
      message: `https://url.workduck.io/link/${data.namespace}/${data.short}`,
    });
  } catch (e) {
    console.error({ e });
    return formatJSONResponse(
      {
        errorMessage: e.message,
        message: 'URL doesnt exist',
      },
      500
    );
  }
};

const navigate: ValidatedEventAPIGatewayProxyEvent<undefined> = async event => {
  try {
    const url_data = await URLEntity.get({
      short: event.pathParameters.short,
      namespace: event.pathParameters.namespace,
    });
    await URLStatsEntity.update({
      namespace: event.pathParameters.namespace,
      short: event.pathParameters.short,
      //@ts-ignore-next-line
      count: {
        $add: 1,
      },
    });
    const data = (url_data as any).Item as URL;
    if (data?.long) {
      if (data.expiry && data.expiry > Date.now())
        return {
          statusCode: 200,

          headers: {
            'Content-Type': 'text/html',
          },
          body: loadingPage(data.long),
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

const stats: ValidatedEventAPIGatewayProxyEvent<undefined> = async event => {
  const url_stats = await URLStatsEntity.get({
    short: event.pathParameters.short,
    namespace: event.pathParameters.namespace,
  });
  return formatJSONResponse(url_stats.Item);
};

const namespaceDetails: ValidatedEventAPIGatewayProxyEvent<
  undefined
> = async event => {
  switch (event.queryStringParameters?.details) {
    case 'stats':
      const url_stats = await URLStatsEntity.query(
        event.pathParameters.namespace,
        {
          beginsWith: 'STATS_',
          entity: 'short',
        }
      );
      return formatJSONResponse(url_stats.Items);
    case 'links':
      const url_links = await URLStatsEntity.query(
        event.pathParameters.namespace,
        {
          beginsWith: 'STATS_',
          entity: 'short',
        }
      );
      return formatJSONResponse(url_links.Items);
    default:
      const url_details = await URLStatsEntity.query(
        event.pathParameters.namespace
      );
      return formatJSONResponse(url_details.Items);
  }
};
export const shorten_main = middyfy(shorten, URLSchema);
export const navigate_main = middyfy(navigate);
export const stats_main = middyfy(stats);
export const namespaceDetails_main = middyfy(namespaceDetails);
export const update_main = middyfy(update);
