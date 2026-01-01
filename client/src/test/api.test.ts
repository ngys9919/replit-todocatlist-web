/**
 * API Tests
 * Reference: TEST_PLAN.md - Section 3.4 API Tests
 */

import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { server } from './mocks/server';
import { resetTodos, getTodos } from './mocks/handlers';
import { api, buildUrl } from '@shared/routes';

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

// Reset handlers after each test
afterEach(() => {
  server.resetHandlers();
  resetTodos();
});

// Close server after all tests
afterAll(() => server.close());

describe('API Tests', () => {
  /**
   * Test Case: API-001
   * Get all todos
   * Endpoint: /api/todos
   * Method: GET
   * Expected Result: Returns array of todos with 200 status
   * Priority: High
   */
  it('API-001: GET /api/todos should return array of todos with 200 status', async () => {
    const response = await fetch(api.todos.list.path);
    
    expect(response.status).toBe(200);
    
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(3); // Initial mock data has 3 todos
    
    // Verify todo structure
    expect(data[0]).toHaveProperty('id');
    expect(data[0]).toHaveProperty('text');
    expect(data[0]).toHaveProperty('completed');
  });

  /**
   * Test Case: API-002
   * Create todo
   * Endpoint: /api/todos
   * Method: POST
   * Expected Result: Creates todo, returns 201 with new todo object
   * Priority: High
   */
  it('API-002: POST /api/todos should create todo and return 201', async () => {
    const newTodo = { text: 'New API test todo', completed: false };
    
    const response = await fetch(api.todos.create.path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTodo),
    });
    
    expect(response.status).toBe(201);
    
    const data = await response.json();
    expect(data.text).toBe('New API test todo');
    expect(data.completed).toBe(false);
    expect(data.id).toBeDefined();
    
    // Verify todo was added
    const todos = getTodos();
    expect(todos.find(t => t.text === 'New API test todo')).toBeTruthy();
  });

  /**
   * Test Case: API-003
   * Create todo - validation
   * Endpoint: /api/todos
   * Method: POST
   * Expected Result: Returns 400 for empty text field
   * Priority: High
   */
  it('API-003: POST /api/todos should return 400 for empty text', async () => {
    const invalidTodo = { text: '', completed: false };
    
    const response = await fetch(api.todos.create.path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invalidTodo),
    });
    
    expect(response.status).toBe(400);
    
    const error = await response.json();
    expect(error).toHaveProperty('message');
  });

  /**
   * Test Case: API-004
   * Update todo
   * Endpoint: /api/todos/:id
   * Method: PATCH
   * Expected Result: Updates todo, returns 200 with updated object
   * Priority: High
   */
  it('API-004: PATCH /api/todos/:id should update todo and return 200', async () => {
    const url = buildUrl(api.todos.update.path, { id: 1 });
    const updates = { completed: true };
    
    const response = await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    
    expect(response.status).toBe(200);
    
    const data = await response.json();
    expect(data.id).toBe(1);
    expect(data.completed).toBe(true);
    
    // Verify update persisted
    const todos = getTodos();
    expect(todos.find(t => t.id === 1)?.completed).toBe(true);
  });

  /**
   * Test Case: API-005
   * Update non-existent todo
   * Endpoint: /api/todos/:id
   * Method: PATCH
   * Expected Result: Returns 404 Not Found
   * Priority: Medium
   */
  it('API-005: PATCH /api/todos/:id should return 404 for non-existent todo', async () => {
    const url = buildUrl(api.todos.update.path, { id: 99999 });
    const updates = { completed: true };
    
    const response = await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    
    expect(response.status).toBe(404);
    
    const error = await response.json();
    expect(error.message).toContain('not found');
  });

  /**
   * Test Case: API-006
   * Delete todo
   * Endpoint: /api/todos/:id
   * Method: DELETE
   * Expected Result: Returns 204 No Content
   * Priority: High
   */
  it('API-006: DELETE /api/todos/:id should return 204', async () => {
    const initialTodos = getTodos();
    const initialCount = initialTodos.length;
    
    const url = buildUrl(api.todos.delete.path, { id: 1 });
    
    const response = await fetch(url, {
      method: 'DELETE',
    });
    
    expect(response.status).toBe(204);
    
    // Verify todo was deleted
    const todos = getTodos();
    expect(todos.length).toBe(initialCount - 1);
    expect(todos.find(t => t.id === 1)).toBeUndefined();
  });

  /**
   * Test Case: API-007
   * Delete non-existent todo
   * Endpoint: /api/todos/:id
   * Method: DELETE
   * Expected Result: Returns 204 (idempotent)
   * Priority: Low
   */
  it('API-007: DELETE /api/todos/:id should return 204 for non-existent todo (idempotent)', async () => {
    const url = buildUrl(api.todos.delete.path, { id: 99999 });
    
    const response = await fetch(url, {
      method: 'DELETE',
    });
    
    // DELETE is idempotent, should return 204 even if not found
    expect(response.status).toBe(204);
  });
});

describe('API Contract Tests', () => {
  /**
   * Test: Verify buildUrl helper works correctly
   * Priority: High
   */
  it('buildUrl should correctly substitute URL parameters', () => {
    const url = buildUrl('/api/todos/:id', { id: 123 });
    expect(url).toBe('/api/todos/123');
  });

  /**
   * Test: Verify API paths are correctly defined
   * Priority: High
   */
  it('should have correct API paths defined', () => {
    expect(api.todos.list.path).toBe('/api/todos');
    expect(api.todos.create.path).toBe('/api/todos');
    expect(api.todos.update.path).toBe('/api/todos/:id');
    expect(api.todos.delete.path).toBe('/api/todos/:id');
  });

  /**
   * Test: Verify API methods are correctly defined
   * Priority: Medium
   */
  it('should have correct HTTP methods defined', () => {
    expect(api.todos.list.method).toBe('GET');
    expect(api.todos.create.method).toBe('POST');
    expect(api.todos.update.method).toBe('PATCH');
    expect(api.todos.delete.method).toBe('DELETE');
  });
});
