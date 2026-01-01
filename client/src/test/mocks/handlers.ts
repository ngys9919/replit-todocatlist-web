import { http, HttpResponse } from 'msw';
import { api } from '@shared/routes';

// Mock todo data
export const mockTodos = [
  { id: 1, text: 'Buy groceries', completed: false },
  { id: 2, text: 'Complete project report', completed: true },
  { id: 3, text: 'Call mom', completed: false },
];

let todos = [...mockTodos];
let nextId = 4;

// Reset todos to initial state
export function resetTodos() {
  todos = [...mockTodos];
  nextId = 4;
}

// Get current todos
export function getTodos() {
  return todos;
}

// MSW handlers for API mocking
export const handlers = [
  // GET /api/todos - List all todos
  http.get(api.todos.list.path, () => {
    return HttpResponse.json(todos);
  }),

  // POST /api/todos - Create a new todo
  http.post(api.todos.create.path, async ({ request }) => {
    const body = await request.json() as { text: string; completed?: boolean };
    
    if (!body.text || body.text.trim() === '') {
      return HttpResponse.json(
        { message: 'Text is required', field: 'text' },
        { status: 400 }
      );
    }

    const newTodo = {
      id: nextId++,
      text: body.text,
      completed: body.completed ?? false,
    };
    todos.push(newTodo);
    return HttpResponse.json(newTodo, { status: 201 });
  }),

  // PATCH /api/todos/:id - Update a todo
  http.patch(`${api.todos.update.path.replace(':id', ':id')}`, async ({ params, request }) => {
    const id = Number(params.id);
    const body = await request.json() as { text?: string; completed?: boolean };
    
    const index = todos.findIndex(t => t.id === id);
    if (index === -1) {
      return HttpResponse.json(
        { message: 'Todo not found' },
        { status: 404 }
      );
    }

    todos[index] = { ...todos[index], ...body };
    return HttpResponse.json(todos[index]);
  }),

  // DELETE /api/todos/:id - Delete a todo
  http.delete(`${api.todos.delete.path.replace(':id', ':id')}`, ({ params }) => {
    const id = Number(params.id);
    const index = todos.findIndex(t => t.id === id);
    
    if (index !== -1) {
      todos.splice(index, 1);
    }
    
    return new HttpResponse(null, { status: 204 });
  }),
];
