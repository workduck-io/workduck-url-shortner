import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import schema from '@resources/models';
import 'source-map-support/register';
import { UserEntity } from './interface';

const UserSchema = schema.definitions.User;
const hello: ValidatedEventAPIGatewayProxyEvent<typeof UserSchema> =
  async event => {
    try {
      await UserEntity.update(event.body, {
        returnValues: 'all_new',
      });
      return formatJSONResponse({
        message: `Hello ${event.body.name}, welcome to the exciting Serverless world!`,
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

export const main = middyfy(hello, UserSchema);
