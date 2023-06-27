import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import schema from '@resources/models';
import 'source-map-support/register';
import { BASE_URL, KEYWORDS } from '../../utils/consts';
import { loadingPage } from '../../utils/loader';
import { extractWorkspaceId, groupBy } from '../../utils/utility';
import { URLEntity, URLStatsEntity } from './entities';
import { URL } from './interface';

const URLSchema = schema.definitions.URL;
const URLSSchema = schema.definitions.URLS;
const shorten: ValidatedEventAPIGatewayProxyEvent<
  typeof URLSchema
> = async event => {
  try {
    const workspace = extractWorkspaceId(event);
    if (KEYWORDS.includes(workspace) || KEYWORDS.includes(event.body.alias)) {
      return formatJSONResponse(
        {
          error: 'Invalid workspace or alias',
        },
        400
      );
    }
    if (event.body.alias) {
      const existingalias = (
        await URLEntity.query(workspace, {
          index: 'pk-ak-index',
          eq: event.body.alias,
          filters: [
            {
              attr: 'url',
              ne: event.body.url,
            },
          ],
        })
      ).Items;
      if (existingalias && existingalias.length > 0)
        return {
          statusCode: 400,
          body: JSON.stringify({
            message: `${event.body.alias} already exists`,
          }),
        };
    }
    const url_data = await URLEntity.update(
      { ...event.body, workspace },
      {
        returnValues: 'ALL_NEW',
      }
    );
    const data = url_data.Attributes;
    return formatJSONResponse(
      data.alias
        ? {
            message: `${BASE_URL}/${data.workspace}/${data.alias}`,
          }
        : {}
    );
  } catch (e) {
    console.error({ e });
    return formatJSONResponse(
      {
        errorMessage: e.message,
        message: 'Error aliasing URL',
      },
      400
    );
  }
};

const shortenMultiple: ValidatedEventAPIGatewayProxyEvent<
  typeof URLSSchema
> = async event => {
  const workspace = extractWorkspaceId(event);
  const urls = event.body.urls as URL[];
  const promises = urls.map(async url => {
    if (KEYWORDS.includes(workspace) || KEYWORDS.includes(url.alias)) {
      throw new Error(JSON.stringify({ error: 'Invalid workspace or alias' }));
    }
    try {
      if (url.alias) {
        const existingalias = (
          await URLEntity.query(workspace, {
            index: 'pk-ak-index',
            eq: event.body.alias as string,
            filters: [
              {
                attr: 'url',
                ne: event.body.url as string,
              },
            ],
          })
        ).Items;
        if (existingalias && existingalias.length > 0)
          throw new Error('Alias exists');
      }
      const url_data = await URLEntity.update(
        { ...url, workspace },
        {
          returnValues: 'ALL_NEW',
        }
      );
      const data = url_data.Attributes;
      return {
        [url.alias]: `${BASE_URL}/${data.workspace}/${data.alias}`,
      };
    } catch (e) {
      console.log(e);

      throw new Error(
        JSON.stringify({
          [url.alias]: 'Cannot create URL',
        })
      );
    }
  });
  const results = await Promise.allSettled(promises);

  const success: any = results.filter(result => result.status === 'fulfilled');
  const failed: any = results.filter(result => result.status === 'rejected');
  return formatJSONResponse({
    success: success.map(result => result.value),
    failed: failed.map(result => JSON.parse(result.reason.message)),
  });
};

const navigate: ValidatedEventAPIGatewayProxyEvent<undefined> = async event => {
  try {
    const url_data = (
      await URLEntity.query(event.pathParameters.workspace, {
        index: 'pk-ak-index',
        eq: event.pathParameters.alias,
        attributes: ['workspace', 'alias', 'url', 'expiry', 'properties'],
      })
    ).Items;
    if (url_data && url_data.length > 0)
      await URLStatsEntity.update({
        workspace: event.pathParameters.workspace,
        url: url_data[0].url,
        count: {
          $add: 1,
        },
      });
    else {
      return {
        statusCode: 404,
        headers: {
          'Content-Type': 'text/html',
        },
        body: '<html>Link broken or <b>doesnt</b> exist</html>',
      };
    }
    const data = url_data[0];

    if (data.expiry && data.expiry > Date.now())
      return {
        statusCode: 200,

        headers: {
          'Content-Type': 'text/html',
        },
        body: loadingPage(data.url, data.properties),
      };
  } catch (e) {
    console.error({ e });
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'text/html',
      },
      body: '<html>Please refresh or try again in sometime</html>',
    };
  }
};

const stats: ValidatedEventAPIGatewayProxyEvent<undefined> = async event => {
  const workspace = extractWorkspaceId(event);
  const url = event.queryStringParameters.url;

  const url_stats = await URLStatsEntity.get({
    url,
    workspace,
  });
  const url_links = await URLEntity.get({
    url,
    workspace,
  });
  return formatJSONResponse({ URL_STATS: url_stats.Item, URL: url_links.Item });
};

const del: ValidatedEventAPIGatewayProxyEvent<undefined> = async event => {
  const link = event.queryStringParameters.url;
  const workspace = extractWorkspaceId(event);
  try {
    await URLStatsEntity.delete({
      link,
      workspace,
    });
    await URLEntity.delete({
      link,
      workspace,
    });
    return formatJSONResponse({ message: 'Successfully deleted' });
  } catch (e) {
    return {
      statusCode: 400,
      message: 'Could not delete',
    };
  }
};

const workspaceDetails: ValidatedEventAPIGatewayProxyEvent<
  undefined
> = async event => {
  const workspace = extractWorkspaceId(event);
  switch (event.queryStringParameters?.details) {
    case 'stats':
      const url_stats = await URLStatsEntity.query(workspace, {
        beginsWith: 'STATS_',
      });
      return formatJSONResponse({ URL_STATS: url_stats.Items });
    case 'links':
      const url_links = await URLStatsEntity.query(workspace, {
        beginsWith: 'LINK_',
      });
      return formatJSONResponse({ URL: url_links.Items });
    default:
      const url_details = await URLStatsEntity.query(workspace);
      return formatJSONResponse(groupBy(url_details.Items, 'entity'));
  }
};
export const shorten_main = middyfy(shorten, URLSchema);
export const shortenMultiple_main = middyfy(shortenMultiple);
export const delete_main = middyfy(del);
export const navigate_main = navigate;
export const stats_main = middyfy(stats);
export const workspaceDetails_main = middyfy(workspaceDetails);
