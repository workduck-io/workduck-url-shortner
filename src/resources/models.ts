export default {
  $schema: 'http://json-schema.org/draft-07/schema#',
  definitions: {
    User: {
      properties: {
        name: {
          type: 'string',
        },
      },
      required: ['name'],
      type: 'object',
    },
  },
} as const;
