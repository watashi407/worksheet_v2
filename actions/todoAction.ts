
'use server';

import { Todo } from '@/types/type';


let todos: Todo[] = [];

export async function createTodo(formData: FormData): Promise<Todo> {
  const newTodo: Todo = {
    id: Date.now().toString(),
    text: formData.get('todoText')?.toString() || "",
    isCompleted: false,
  };

  todos.push(newTodo);
  return newTodo;
}

export async function getTodos(): Promise<Todo[]> {
  return todos;
}

export async function updateTodo(id: string, formData: FormData): Promise<Todo | null> {
  const updatedText = formData.get('todoText')?.toString() || "";
  
  const todoIndex = todos.findIndex(todo => todo.id === id);
  if (todoIndex !== -1) {
    todos[todoIndex].text = updatedText;
    return todos[todoIndex];
  }
  
  return null;
}

export async function deleteTodo(id: string): Promise<void> {
  todos = todos.filter(todo => todo.id !== id);
}

export async function toggleTodoCompletion(id: string): Promise<Todo | null> {
  const todoIndex = todos.findIndex(todo => todo.id === id);
  if (todoIndex !== -1) {
    todos[todoIndex].isCompleted = !todos[todoIndex].isCompleted;
    return todos[todoIndex];
  }
  
  return null; 
}
