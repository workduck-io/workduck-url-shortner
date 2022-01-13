import { handlerPath } from '@libs/handlerResolver';

export const shorten = {
  handler: `${handlerPath(__dirname)}/handler.shorten_main`,
  events: [
    {
      httpApi: {
        method: 'POST',
        path: '/shorten',
        authorizers: 'workduckAuthorizer',
      },
    },
  ],
};

export const navigate = {
  handler: `${handlerPath(__dirname)}/handler.navigate_main`,
  events: [
    {
      httpApi: {
        method: 'GET',
        path: '/{namespace}/{short}',
      },
    },
  ],
};

export const stats = {
  handler: `${handlerPath(__dirname)}/handler.stats_main`,
  events: [
    {
      httpApi: {
        method: 'GET',
        path: '/{namespace}/{short}/stats',
        authorizers: 'workduckAuthorizer',
      },
    },
  ],
};
