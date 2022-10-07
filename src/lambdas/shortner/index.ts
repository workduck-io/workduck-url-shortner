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
        path: '/{workspace}/{alias}',
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
        path: '/{workspace}/stats/{url}',
        authorizer: 'workduckAuthorizer',
      },
    },
  ],
};

export const del = {
  handler: `${handlerPath(__dirname)}/handler.delete_main`,
  events: [
    {
      httpApi: {
        method: 'DELETE',
        path: '/{workspace}/stats/{url}',
        authorizer: 'workduckAuthorizer',
      },
    },
  ],
};

export const workspaceDetails = {
  handler: `${handlerPath(__dirname)}/handler.workspaceDetails_main`,
  events: [
    {
      httpApi: {
        method: 'GET',
        path: '/{workspace}/stats',
        authorizer: 'workduckAuthorizer',
      },
    },
  ],
};
