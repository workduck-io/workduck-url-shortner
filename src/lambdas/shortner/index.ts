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

export const update = {
  handler: `${handlerPath(__dirname)}/handler.update_main`,
  events: [
    {
      httpApi: {
        method: 'POST',
        path: '/update',
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

export const namespaceDetails = {
  handler: `${handlerPath(__dirname)}/handler.namespaceDetails_main`,
  events: [
    {
      httpApi: {
        method: 'GET',
        path: '/{namespace}/stats',
        authorizers: 'workduckAuthorizer',
      },
    },
  ],
};
