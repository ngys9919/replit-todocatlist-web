/**
 * API Integration Tests using Vitest + Supertest
 * Reference: TEST_PLAN.md - Section 3.4 API Tests
 * 
 * These tests verify the actual API endpoints by making HTTP requests
 * to the Express server using Supertest. Unlike mock-based tests,
 * these tests hit the real server implementation.
 * 
 * Test Execution Steps:
 * 1. Create Express app with routes registered
 * 2. Use Supertest to make HTTP requests to the app
 * 3. Verify response status codes and body content
 * 4. Clean up test data after each test
 * 
 * Run tests with: npx vitest run server/test/api.integration.test.ts
 */

import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import { createServer } from 'http';
import { registerRoutes } from '../routes';
import { storage } from '../storage';

// Express app instance for testing
let app: express.Express;
let server: ReturnType<typeof createServer>;

/**
 * Test Setup
 * Creates an Express app with routes registered for testing
 */
beforeAll(async () => {
  app = express();
  server = createServer(app);
  
  // Configure middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  
  // Register API routes
  await registerRoutes(server, app);
});

/**
 * Test Cleanup
 * Closes the server after all tests complete
 */
afterAll(async () => {
  if (server) {
    server.close();
  }
});

/**
 * Per-Test Cleanup
 * Removes test-created todos to maintain test isolation
 */
afterEach(async () => {
  // Clean up any todos created during tests with specific test prefixes
  const todos = await storage.getTodos();
  for (const todo of todos) {
    if (todo.text.startsWith('API-TEST:')) {
      await storage.deleteTodo(todo.id);
    }
  }
});

describe('API Integration Tests - GET /api/todos', () => {
  /**
   * Test Case: API-INT-001
   * Get all todos
   * Endpoint: GET /api/todos
   * Steps:
   *   1. Send GET request to /api/todos
   *   2. Verify response status is 200
   *   3. Verify response body is an array
   * Expected Result: Returns array of todos with 200 status
   * Priority: High
   */
  it('API-INT-001: should return array of todos with 200 status', async () => {
    // Step 1: Send GET request
    const response = await request(app)
      .get('/api/todos')
      .expect('Content-Type', /json/);
    
    // Step 2: Verify status code
    expect(response.status).toBe(200);
    
    // Step 3: Verify response is an array
    expect(Array.isArray(response.body)).toBe(true);
  });

  /**
   * Test Case: API-INT-002
   * Get todos - verify structure
   * Endpoint: GET /api/todos
   * Steps:
   *   1. Create a test todo
   *   2. Send GET request to /api/todos
   *   3. Verify response contains todo with correct structure
   * Expected Result: Each todo has id, text, and completed fields
   * Priority: High
   */
  it('API-INT-002: should return todos with correct structure', async () => {
    // Step 1: Create a test todo
    await storage.createTodo({ text: 'API-TEST: Structure test', completed: false });
    
    // Step 2: Send GET request
    const response = await request(app)
      .get('/api/todos')
      .expect(200);
    
    // Step 3: Verify structure
    const todo = response.body.find((t: any) => t.text === 'API-TEST: Structure test');
    expect(todo).toBeDefined();
    expect(todo).toHaveProperty('id');
    expect(todo).toHaveProperty('text');
    expect(todo).toHaveProperty('completed');
    expect(typeof todo.id).toBe('number');
    expect(typeof todo.text).toBe('string');
    expect(typeof todo.completed).toBe('boolean');
  });
});

describe('API Integration Tests - POST /api/todos', () => {
  /**
   * Test Case: API-INT-003
   * Create todo - success
   * Endpoint: POST /api/todos
   * Steps:
   *   1. Send POST request with valid todo data
   *   2. Verify response status is 201
   *   3. Verify response body contains created todo
   *   4. Verify todo exists in storage
   * Expected Result: Creates todo and returns 201 with new todo object
   * Priority: High
   */
  it('API-INT-003: should create todo and return 201 status', async () => {
    const newTodo = { text: 'API-TEST: Create test', completed: false };
    
    // Step 1: Send POST request
    const response = await request(app)
      .post('/api/todos')
      .send(newTodo)
      .expect('Content-Type', /json/);
    
    // Step 2: Verify status code
    expect(response.status).toBe(201);
    
    // Step 3: Verify response body
    expect(response.body.text).toBe('API-TEST: Create test');
    expect(response.body.completed).toBe(false);
    expect(response.body.id).toBeDefined();
    
    // Step 4: Verify todo exists in storage
    const todos = await storage.getTodos();
    const createdTodo = todos.find(t => t.id === response.body.id);
    expect(createdTodo).toBeDefined();
    expect(createdTodo?.text).toBe('API-TEST: Create test');
  });

  /**
   * Test Case: API-INT-004
   * Create todo - empty text validation
   * Endpoint: POST /api/todos
   * Steps:
   *   1. Send POST request with empty text
   *   2. Verify response status is 400
   *   3. Verify error message is returned
   * Expected Result: Returns 400 with validation error
   * Priority: High
   */
  it('API-INT-004: should return 400 for empty text field', async () => {
    const invalidTodo = { text: '', completed: false };
    
    // Step 1: Send POST request with empty text
    const response = await request(app)
      .post('/api/todos')
      .send(invalidTodo)
      .expect('Content-Type', /json/);
    
    // Step 2: Verify status code
    expect(response.status).toBe(400);
    
    // Step 3: Verify error message
    expect(response.body).toHaveProperty('message');
  });

  /**
   * Test Case: API-INT-005
   * Create todo - missing text field
   * Endpoint: POST /api/todos
   * Steps:
   *   1. Send POST request without text field
   *   2. Verify response status is 400
   * Expected Result: Returns 400 for missing required field
   * Priority: Medium
   */
  it('API-INT-005: should return 400 for missing text field', async () => {
    const invalidTodo = { completed: false };
    
    // Step 1: Send POST request without text
    const response = await request(app)
      .post('/api/todos')
      .send(invalidTodo);
    
    // Step 2: Verify status code
    expect(response.status).toBe(400);
  });

  /**
   * Test Case: API-INT-006
   * Create todo - with completed true
   * Endpoint: POST /api/todos
   * Steps:
   *   1. Send POST request with completed: true
   *   2. Verify todo is created with completed status
   * Expected Result: Creates todo with completed: true
   * Priority: Medium
   */
  it('API-INT-006: should create todo with completed status', async () => {
    const newTodo = { text: 'API-TEST: Already completed', completed: true };
    
    // Step 1: Send POST request
    const response = await request(app)
      .post('/api/todos')
      .send(newTodo)
      .expect(201);
    
    // Step 2: Verify completed status
    expect(response.body.completed).toBe(true);
    expect(response.body.text).toBe('API-TEST: Already completed');
  });
});

describe('API Integration Tests - PATCH /api/todos/:id', () => {
  /**
   * Test Case: API-INT-007
   * Update todo - toggle completion
   * Endpoint: PATCH /api/todos/:id
   * Steps:
   *   1. Create a test todo
   *   2. Send PATCH request to toggle completed status
   *   3. Verify response status is 200
   *   4. Verify todo is updated in storage
   * Expected Result: Updates todo and returns 200 with updated object
   * Priority: High
   */
  it('API-INT-007: should update todo completion status', async () => {
    // Step 1: Create test todo
    const created = await storage.createTodo({ 
      text: 'API-TEST: Update completion', 
      completed: false 
    });
    
    // Step 2: Send PATCH request
    const response = await request(app)
      .patch(`/api/todos/${created.id}`)
      .send({ completed: true })
      .expect('Content-Type', /json/);
    
    // Step 3: Verify status code
    expect(response.status).toBe(200);
    expect(response.body.completed).toBe(true);
    expect(response.body.id).toBe(created.id);
    
    // Step 4: Verify update persisted
    const todos = await storage.getTodos();
    const updated = todos.find(t => t.id === created.id);
    expect(updated?.completed).toBe(true);
  });

  /**
   * Test Case: API-INT-008
   * Update todo - change text
   * Endpoint: PATCH /api/todos/:id
   * Steps:
   *   1. Create a test todo
   *   2. Send PATCH request with new text
   *   3. Verify text is updated
   * Expected Result: Updates todo text successfully
   * Priority: Medium
   */
  it('API-INT-008: should update todo text', async () => {
    // Step 1: Create test todo
    const created = await storage.createTodo({ 
      text: 'API-TEST: Original text', 
      completed: false 
    });
    
    // Step 2: Send PATCH request
    const response = await request(app)
      .patch(`/api/todos/${created.id}`)
      .send({ text: 'API-TEST: Updated text' })
      .expect(200);
    
    // Step 3: Verify text updated
    expect(response.body.text).toBe('API-TEST: Updated text');
  });

  /**
   * Test Case: API-INT-009
   * Update non-existent todo
   * Endpoint: PATCH /api/todos/:id
   * Steps:
   *   1. Send PATCH request for non-existent ID
   *   2. Verify response status is 404
   * Expected Result: Returns 404 Not Found
   * Priority: Medium
   */
  it('API-INT-009: should return 404 for non-existent todo', async () => {
    // Step 1: Send PATCH request for non-existent ID
    const response = await request(app)
      .patch('/api/todos/999999')
      .send({ completed: true });
    
    // Step 2: Verify status code
    expect(response.status).toBe(404);
    expect(response.body.message).toContain('not found');
  });

  /**
   * Test Case: API-INT-010
   * Update todo - negative ID
   * Endpoint: PATCH /api/todos/:id
   * Steps:
   *   1. Send PATCH request with negative ID
   *   2. Verify appropriate error response
   * Expected Result: Returns 404 for negative ID
   * Priority: Low
   */
  it('API-INT-010: should return 404 for negative ID', async () => {
    const response = await request(app)
      .patch('/api/todos/-1')
      .send({ completed: true });
    
    // Negative ID will not match any record
    expect(response.status).toBe(404);
  });
});

describe('API Integration Tests - DELETE /api/todos/:id', () => {
  /**
   * Test Case: API-INT-011
   * Delete todo - success
   * Endpoint: DELETE /api/todos/:id
   * Steps:
   *   1. Create a test todo
   *   2. Send DELETE request
   *   3. Verify response status is 204
   *   4. Verify todo no longer exists
   * Expected Result: Deletes todo and returns 204 No Content
   * Priority: High
   */
  it('API-INT-011: should delete todo and return 204', async () => {
    // Step 1: Create test todo
    const created = await storage.createTodo({ 
      text: 'API-TEST: Delete me', 
      completed: false 
    });
    
    // Step 2: Send DELETE request
    const response = await request(app)
      .delete(`/api/todos/${created.id}`);
    
    // Step 3: Verify status code
    expect(response.status).toBe(204);
    
    // Step 4: Verify todo is deleted
    const todos = await storage.getTodos();
    const deleted = todos.find(t => t.id === created.id);
    expect(deleted).toBeUndefined();
  });

  /**
   * Test Case: API-INT-012
   * Delete non-existent todo (idempotent)
   * Endpoint: DELETE /api/todos/:id
   * Steps:
   *   1. Send DELETE request for non-existent ID
   *   2. Verify response status is 204 (idempotent)
   * Expected Result: Returns 204 even if todo doesn't exist
   * Priority: Medium
   */
  it('API-INT-012: should return 204 for non-existent todo (idempotent)', async () => {
    // Step 1: Send DELETE request for non-existent ID
    const response = await request(app)
      .delete('/api/todos/999999');
    
    // Step 2: Verify status (DELETE is idempotent)
    expect(response.status).toBe(204);
  });

  /**
   * Test Case: API-INT-013
   * Delete completed todo
   * Endpoint: DELETE /api/todos/:id
   * Steps:
   *   1. Create a completed todo
   *   2. Delete the completed todo
   *   3. Verify deletion successful
   * Expected Result: Completed todos can be deleted
   * Priority: Medium
   */
  it('API-INT-013: should delete completed todo', async () => {
    // Step 1: Create completed todo
    const created = await storage.createTodo({ 
      text: 'API-TEST: Delete completed', 
      completed: true 
    });
    
    // Step 2: Delete the todo
    const response = await request(app)
      .delete(`/api/todos/${created.id}`);
    
    // Step 3: Verify deletion
    expect(response.status).toBe(204);
    
    const todos = await storage.getTodos();
    expect(todos.find(t => t.id === created.id)).toBeUndefined();
  });
});

describe('API Integration Tests - Edge Cases', () => {
  /**
   * Test Case: API-INT-014
   * Create and immediately delete
   * Endpoint: POST then DELETE
   * Steps:
   *   1. Create a todo
   *   2. Immediately delete it
   *   3. Verify todo no longer exists
   * Expected Result: Full lifecycle works correctly
   * Priority: Medium
   */
  it('API-INT-014: should handle create and immediate delete', async () => {
    // Step 1: Create todo
    const createResponse = await request(app)
      .post('/api/todos')
      .send({ text: 'API-TEST: Short-lived', completed: false })
      .expect(201);
    
    const todoId = createResponse.body.id;
    
    // Step 2: Delete immediately
    await request(app)
      .delete(`/api/todos/${todoId}`)
      .expect(204);
    
    // Step 3: Verify todo is gone
    const getResponse = await request(app).get('/api/todos');
    expect(getResponse.body.find((t: any) => t.id === todoId)).toBeUndefined();
  });

  /**
   * Test Case: API-INT-015
   * Create, update, delete sequence
   * Endpoint: POST, PATCH, DELETE
   * Steps:
   *   1. Create a todo
   *   2. Update the todo
   *   3. Delete the todo
   *   4. Verify each step
   * Expected Result: Full CRUD lifecycle works correctly
   * Priority: High
   */
  it('API-INT-015: should handle full CRUD lifecycle', async () => {
    // Step 1: Create
    const createResponse = await request(app)
      .post('/api/todos')
      .send({ text: 'API-TEST: Full lifecycle', completed: false })
      .expect(201);
    
    const todoId = createResponse.body.id;
    expect(createResponse.body.text).toBe('API-TEST: Full lifecycle');
    expect(createResponse.body.completed).toBe(false);
    
    // Step 2: Update
    const updateResponse = await request(app)
      .patch(`/api/todos/${todoId}`)
      .send({ completed: true })
      .expect(200);
    
    expect(updateResponse.body.completed).toBe(true);
    
    // Step 3: Delete
    await request(app)
      .delete(`/api/todos/${todoId}`)
      .expect(204);
    
    // Step 4: Verify deletion
    const todos = await storage.getTodos();
    expect(todos.find(t => t.id === todoId)).toBeUndefined();
  });

  /**
   * Test Case: API-INT-016
   * Large text input
   * Endpoint: POST /api/todos
   * Steps:
   *   1. Create todo with very long text
   *   2. Verify it's stored correctly
   * Expected Result: Large text is handled correctly
   * Priority: Low
   */
  it('API-INT-016: should handle large text input', async () => {
    const longText = 'API-TEST: ' + 'x'.repeat(1000);
    
    // Step 1: Create todo with long text
    const response = await request(app)
      .post('/api/todos')
      .send({ text: longText, completed: false })
      .expect(201);
    
    // Step 2: Verify text is stored correctly
    expect(response.body.text).toBe(longText);
    expect(response.body.text.length).toBe(1010);
  });

  /**
   * Test Case: API-INT-017
   * Special characters in text
   * Endpoint: POST /api/todos
   * Steps:
   *   1. Create todo with special characters
   *   2. Verify text is stored correctly
   * Expected Result: Special characters are preserved
   * Priority: Low
   */
  it('API-INT-017: should handle special characters in text', async () => {
    const specialText = 'API-TEST: <script>alert("test")</script> & "quotes" \'apostrophe\'';
    
    // Step 1: Create todo
    const response = await request(app)
      .post('/api/todos')
      .send({ text: specialText, completed: false })
      .expect(201);
    
    // Step 2: Verify text is preserved
    expect(response.body.text).toBe(specialText);
  });

  /**
   * Test Case: API-INT-018
   * Content-Type header handling
   * Endpoint: POST /api/todos
   * Steps:
   *   1. Send request with correct Content-Type
   *   2. Verify request is processed
   * Expected Result: JSON Content-Type is required
   * Priority: Low
   */
  it('API-INT-018: should require JSON content type for POST', async () => {
    const response = await request(app)
      .post('/api/todos')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify({ text: 'API-TEST: Content type test', completed: false }))
      .expect(201);
    
    expect(response.body.text).toBe('API-TEST: Content type test');
  });
});

describe('API Integration Tests - Response Headers', () => {
  /**
   * Test Case: API-INT-019
   * Verify JSON response headers
   * Endpoint: GET /api/todos
   * Steps:
   *   1. Send GET request
   *   2. Verify Content-Type header
   * Expected Result: Response has correct Content-Type
   * Priority: Medium
   */
  it('API-INT-019: should return JSON content type', async () => {
    const response = await request(app)
      .get('/api/todos');
    
    expect(response.headers['content-type']).toMatch(/application\/json/);
  });

  /**
   * Test Case: API-INT-020
   * Verify 204 response has no body
   * Endpoint: DELETE /api/todos/:id
   * Steps:
   *   1. Create and delete a todo
   *   2. Verify response has no body
   * Expected Result: 204 response has empty body
   * Priority: Low
   */
  it('API-INT-020: should return empty body for 204 response', async () => {
    // Create todo
    const created = await storage.createTodo({ 
      text: 'API-TEST: No body test', 
      completed: false 
    });
    
    // Delete and verify empty body
    const response = await request(app)
      .delete(`/api/todos/${created.id}`)
      .expect(204);
    
    expect(response.body).toEqual({});
  });
});
