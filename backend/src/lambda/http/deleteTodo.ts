import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { deleteTodo } from '../../businessLogic/todos'
import { getUserId } from '../utils'
import { removeAttachment } from '../../helpers/AttachmentUtils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    // TODO: Remove a TODO item by id
    const userId: string = getUserId(event);
    await deleteTodo(userId, todoId);
    await removeAttachment(todoId);


    return {
      statusCode: 200,
      body: JSON.stringify({})
    };
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      origin: "*",
      credentials: true
    })
  )
