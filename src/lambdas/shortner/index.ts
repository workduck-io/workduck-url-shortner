import { handlerPath } from '@libs/handlerResolver';

export const shorten = {
  handler: `${handlerPath(__dirname)}/handler.shorten_main`,
  events: [
    {
      httpApi: {
        method: 'POST',
        path: '/shorten',
        authorizer: 'workduckAuthorizer',
      },
    },
  ],
};

export const shortenMultiple = {
  handler: `${handlerPath(__dirname)}/handler.shortenMultiple_main`,
  events: [
    {
      httpApi: {
        method: 'POST',
        path: '/shorten/multiple',
        authorizer: 'workduckAuthorizer',
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
        authorizer: 'workduckAuthorizer',
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
        authorizer: 'workduckAuthorizer',
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
        authorizer: 'workduckAuthorizer',
      },
    },
  ],
};
