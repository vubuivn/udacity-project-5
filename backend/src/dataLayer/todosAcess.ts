import * as AWS from 'aws-sdk'
const AWSXRay = require('aws-xray-sdk');
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';

const XAWS = AWSXRay.captureAWS(AWS);

const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic
export class TodoAccess {
    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly todosTable = process.env.TODOS_TABLE,
        private readonly todosIndex = process.env.TODOS_INDEX
    ) {
    }

    // Get Todo
    async getAllTodos(userId: string): Promise<TodoItem[]> {
        logger.info('Getting Todos')
    
        const result = await this.docClient.query({
          TableName: this.todosTable,
          IndexName: this.todosIndex,
          KeyConditionExpression: 'userId = :userId',
          ExpressionAttributeValues: {
            ':userId': userId
          }
        }).promise()
    
        const items = result.Items
        return items as TodoItem[]
    }

    //Create Todo
    async createTodo(todoItem: TodoItem): Promise<TodoItem> {
        logger.info('Create A New Todo - check user ID')
    
        await this.docClient.put({
          TableName: this.todosTable,
          Item: todoItem
        }).promise()
    
        return todoItem
    }
     
    // Update Todo
    async updateTodo(
        todoId: String, 
        userId: String, 
        updateTodoItem: TodoUpdate): Promise<TodoUpdate> 
    
        {
        logger.info('Update todo')
    
        await this.docClient.update({
          TableName: this.todosTable,
          Key: {
            todoId: todoId,
            userId: userId
          },
          UpdateExpression: "set #todo_name = :name, dueDate = :dueDate, done = :done",
          ExpressionAttributeNames: {
            '#todo_name': 'name',
          },
          ExpressionAttributeValues: {
            ":name": updateTodoItem.name,
            ":dueDate": updateTodoItem.dueDate,
            ":done": updateTodoItem.done
          }
        }).promise()
        
        return updateTodoItem
        }

    // Delete Todo
    async deleteTodo(userId: string, todoId: string): Promise<void> {
        await this.docClient.delete({
          TableName: this.todosTable,
          Key: {
            todoId,
            userId
          }
        }).promise();
    
        return;
      }
}

export function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
      return new XAWS.DynamoDB.DocumentClient({
        region: 'localhost',
        endpoint: 'http://localhost:8000'
      })
    }
  
    return new XAWS.DynamoDB.DocumentClient()
  }