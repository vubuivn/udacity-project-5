import { TodoAccess } from './todosAcess'
// import { AttachmentUtils } from './attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
// import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
// import * as createError from 'http-errors'

// TODO: Implement businessLogic
// declare const
// const attachmentUtils   = new AttachmentUtils();
// const logger            = createLogger('TODO: Implement businessLogic');

// function GetTodos
const TodosAccess =  new TodoAccess()

export async function getTodosForUser(userId: string): Promise<TodoItem[]> {
    return TodosAccess.getAllTodos(userId);
}

// function CreateTodo
export async function createTodo(userId: string, createTodoRequest: CreateTodoRequest): Promise<TodoItem> {
    const itemId = uuid.v4();
  
    return await TodosAccess.createTodo({
        todoId: itemId,
        userId: userId,
        name: createTodoRequest.name,
        dueDate: createTodoRequest.dueDate,
        createdAt: new Date().toISOString(),
        done: false
      })
  }

// UpdateTodo
// export async function UpdateTodo(userId: string): Promise<TodoItem> {}
export async function updateTodo(todoId: string, userId: string, updateTodoRequest: UpdateTodoRequest): Promise<TodoUpdate> {
    return await TodosAccess.updateTodo(todoId, userId, {
      name:     updateTodoRequest.name,
      dueDate:  updateTodoRequest.dueDate,
      done:     updateTodoRequest.done
    })
  }

// DeleteTodo
// export async function DeleteTodo(userId: string): Promise<TodoItem> {}
export async function deleteTodo(userId: string, id: string): Promise<void> {
    return TodosAccess.deleteTodo(userId, id);
}

