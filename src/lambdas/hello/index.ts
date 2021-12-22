import { handlerPath } from '@libs/handlerResolver';

export const shorten = {
  handler: `${handlerPath(__dirname)}/handler.shorten_main`,
  events: [
    {
      http: {
        method: 'POST',
        path: '/shorten',
      },
    },
  ],
};

export const navigate = {
  handler: `${handlerPath(__dirname)}/handler.navigate_main`,
  events: [
    {
      http: {
        method: 'get',
        path: '/{short}',
      },
    },
  ],
};
