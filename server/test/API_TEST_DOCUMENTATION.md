# API Integration Tests Documentation

## Overview

This document describes the API integration tests for the Todo Checklist Web Application. The tests use **Vitest** as the test runner and **Supertest** for making HTTP requests to the Express server.

## Technology Stack

| Technology | Purpose |
|------------|---------|
| **Vitest** | Test runner and assertion library |
| **Supertest** | HTTP assertions and request library |
| **Express** | API server framework |
| **PostgreSQL** | Database (via Drizzle ORM) |

## Test File Structure

```
server/
└── test/
    ├── api.integration.test.ts    # API integration tests with Supertest
    ├── vitest.config.ts           # Vitest configuration for server tests
    └── API_TEST_DOCUMENTATION.md  # This documentation
```

## Running the Tests

### Prerequisites

1. Ensure the database is running and accessible
2. Environment variables are configured (DATABASE_URL, etc.)

### Commands

```bash
# Run all API integration tests
npx vitest run server/test/api.integration.test.ts

# Run tests in watch mode
npx vitest server/test/api.integration.test.ts

# Run with verbose output
npx vitest run server/test/api.integration.test.ts --reporter=verbose
```

## Testing Approach

### Test Setup Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Test Initialization                       │
├─────────────────────────────────────────────────────────────┤
│ 1. Create Express app instance                              │
│ 2. Configure middleware (json, urlencoded)                  │
│ 3. Register API routes                                      │
│ 4. Create HTTP server (not started)                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Test Execution                          │
├─────────────────────────────────────────────────────────────┤
│ 1. Supertest makes HTTP request to Express app              │
│ 2. Express processes request through routes                 │
│ 3. Storage layer interacts with database                    │
│ 4. Response is returned and assertions are made             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Test Cleanup                            │
├─────────────────────────────────────────────────────────────┤
│ 1. Remove test-created todos (prefix: "API-TEST:")          │
│ 2. Reset any modified state                                 │
│ 3. Close server after all tests                             │
└─────────────────────────────────────────────────────────────┘
```

### Test Isolation Strategy

- All test-created todos use the prefix `API-TEST:` in their text
- After each test, todos with this prefix are automatically deleted
- This ensures tests don't interfere with each other or production data

## Test Cases

### GET /api/todos

| Test ID | Description | Expected Result | Priority |
|---------|-------------|-----------------|----------|
| API-INT-001 | Get all todos | Returns 200 with array | High |
| API-INT-002 | Verify todo structure | Each todo has id, text, completed | High |

### POST /api/todos

| Test ID | Description | Expected Result | Priority |
|---------|-------------|-----------------|----------|
| API-INT-003 | Create todo - success | Returns 201 with created todo | High |
| API-INT-004 | Create todo - empty text | Returns 400 validation error | High |
| API-INT-005 | Create todo - missing text | Returns 400 for missing field | Medium |
| API-INT-006 | Create todo - with completed | Creates with completed status | Medium |

### PATCH /api/todos/:id

| Test ID | Description | Expected Result | Priority |
|---------|-------------|-----------------|----------|
| API-INT-007 | Update completion status | Returns 200 with updated todo | High |
| API-INT-008 | Update todo text | Returns 200 with new text | Medium |
| API-INT-009 | Update non-existent todo | Returns 404 Not Found | Medium |
| API-INT-010 | Update with invalid ID | Returns 404 for invalid ID | Low |

### DELETE /api/todos/:id

| Test ID | Description | Expected Result | Priority |
|---------|-------------|-----------------|----------|
| API-INT-011 | Delete todo - success | Returns 204 No Content | High |
| API-INT-012 | Delete non-existent (idempotent) | Returns 204 | Medium |
| API-INT-013 | Delete completed todo | Returns 204 | Medium |

### Edge Cases

| Test ID | Description | Expected Result | Priority |
|---------|-------------|-----------------|----------|
| API-INT-014 | Create and immediately delete | Full lifecycle works | Medium |
| API-INT-015 | Full CRUD lifecycle | All operations work sequentially | High |
| API-INT-016 | Large text input | Handles 1000+ characters | Low |
| API-INT-017 | Special characters | Preserves special chars | Low |
| API-INT-018 | Content-Type handling | JSON content type works | Low |

### Response Headers

| Test ID | Description | Expected Result | Priority |
|---------|-------------|-----------------|----------|
| API-INT-019 | JSON response type | Content-Type is application/json | Medium |
| API-INT-020 | 204 empty body | No body for DELETE response | Low |

## Supertest Usage Examples

### Basic GET Request

```typescript
const response = await request(app)
  .get('/api/todos')
  .expect('Content-Type', /json/)
  .expect(200);

expect(Array.isArray(response.body)).toBe(true);
```

### POST with Body

```typescript
const response = await request(app)
  .post('/api/todos')
  .send({ text: 'New todo', completed: false })
  .expect(201);

expect(response.body.text).toBe('New todo');
```

### PATCH Update

```typescript
const response = await request(app)
  .patch('/api/todos/1')
  .send({ completed: true })
  .expect(200);

expect(response.body.completed).toBe(true);
```

### DELETE

```typescript
await request(app)
  .delete('/api/todos/1')
  .expect(204);
```

## Error Response Format

All API errors return JSON with the following structure:

```typescript
{
  "message": "Error description",
  "field": "optional_field_name"  // For validation errors
}
```

## Best Practices Used

1. **Test Isolation**: Each test cleans up after itself
2. **Descriptive Test Names**: Test IDs and descriptions follow a pattern
3. **Step Comments**: Each test has numbered steps for clarity
4. **Assertions on Multiple Levels**: Status code, headers, and body
5. **Edge Case Coverage**: Special characters, large inputs, invalid data
6. **Idempotent Operations**: DELETE returns 204 even for non-existent resources

## Integration with CI/CD

These tests can be run in a CI/CD pipeline with:

```bash
# Install dependencies
npm install

# Run database migrations
npm run db:push

# Run API integration tests
npx vitest run server/test/api.integration.test.ts
```

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Ensure DATABASE_URL is set
   - Check if PostgreSQL is running

2. **Test Timeouts**
   - Increase timeout in vitest.config.ts
   - Check for slow database queries

3. **Test Isolation Failures**
   - Ensure cleanup runs after each test
   - Check for missing `API-TEST:` prefix in test data
