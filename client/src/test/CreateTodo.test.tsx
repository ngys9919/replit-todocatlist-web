/**
 * Create Todo / Add Todo Tests
 * Reference: TEST_PLAN.md - Section 3.2.2 Add Todo Tests
 */

import { describe, it, expect, vi, beforeAll, afterAll, afterEach } from 'vitest';
import { render, screen, waitFor } from './test-utils';
import userEvent from '@testing-library/user-event';
import { CreateTodo } from '@/components/CreateTodo';
import { server } from './mocks/server';
import { resetTodos, getTodos } from './mocks/handlers';

// Mock toast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

// Reset handlers after each test
afterEach(() => {
  server.resetHandlers();
  resetTodos();
});

// Close server after all tests
afterAll(() => server.close());

describe('Create Todo Tests', () => {
  /**
   * Test Case: AT-001
   * Add new todo item
   * Steps: 1. Type text in input field 2. Submit (click add or press Enter)
   * Expected Result: New todo appears in the list
   * Priority: High
   */
  it('AT-001: should add a new todo when form is submitted', async () => {
    const user = userEvent.setup();
    render(<CreateTodo />);
    
    const input = screen.getByPlaceholderText(/What needs to be done/i);
    const submitButton = screen.getByRole('button');
    
    await user.type(input, 'New test todo');
    await user.click(submitButton);
    
    // Verify the todo was added to mock data
    await waitFor(() => {
      const todos = getTodos();
      expect(todos.find(t => t.text === 'New test todo')).toBeTruthy();
    });
  });

  /**
   * Test Case: AT-002
   * Add todo with long text
   * Steps: Enter a todo with 100+ characters
   * Expected Result: Todo is added and text displays properly
   * Priority: Medium
   */
  it('AT-002: should handle long todo text', async () => {
    const user = userEvent.setup();
    render(<CreateTodo />);
    
    const longText = 'This is an extremely long todo item that tests how the application handles text overflow and wrapping in the user interface when someone types more than expected';
    
    const input = screen.getByPlaceholderText(/What needs to be done/i);
    const submitButton = screen.getByRole('button');
    
    await user.type(input, longText);
    await user.click(submitButton);
    
    await waitFor(() => {
      const todos = getTodos();
      expect(todos.find(t => t.text === longText)).toBeTruthy();
    });
  });

  /**
   * Test Case: AT-003
   * Prevent empty todo
   * Steps: Try to submit with empty input
   * Expected Result: Todo is not added; button is disabled
   * Priority: High
   */
  it('AT-003: should not allow submitting empty todo', async () => {
    render(<CreateTodo />);
    
    const submitButton = screen.getByRole('button');
    
    // Button should be disabled when input is empty
    expect(submitButton).toBeDisabled();
  });

  /**
   * Test Case: AT-003 (continued)
   * Prevent whitespace-only todo
   * Steps: Try to submit with only spaces
   * Expected Result: Todo is not added; button remains disabled
   * Priority: High
   */
  it('AT-003b: should not allow submitting whitespace-only todo', async () => {
    const user = userEvent.setup();
    render(<CreateTodo />);
    
    const input = screen.getByPlaceholderText(/What needs to be done/i);
    const submitButton = screen.getByRole('button');
    
    await user.type(input, '   ');
    
    // Button should still be disabled for whitespace-only input
    expect(submitButton).toBeDisabled();
  });

  /**
   * Test Case: AT-005
   * Input field clears after add
   * Steps: Add a new todo
   * Expected Result: Input field is cleared after successful submission
   * Priority: Medium
   */
  it('AT-005: should clear input field after successful submission', async () => {
    const user = userEvent.setup();
    render(<CreateTodo />);
    
    const input = screen.getByPlaceholderText(/What needs to be done/i);
    const submitButton = screen.getByRole('button');
    
    await user.type(input, 'Test todo to clear');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(input).toHaveValue('');
    });
  });

  /**
   * Test Case: Input field accepts Enter key to submit
   * Steps: Type text and press Enter
   * Expected Result: Todo is submitted
   * Priority: Medium
   */
  it('should submit on Enter key press', async () => {
    const user = userEvent.setup();
    render(<CreateTodo />);
    
    const input = screen.getByPlaceholderText(/What needs to be done/i);
    
    await user.type(input, 'Enter key test{enter}');
    
    await waitFor(() => {
      const todos = getTodos();
      expect(todos.find(t => t.text === 'Enter key test')).toBeTruthy();
    });
  });

  /**
   * Test Case: Input placeholder is visible
   * Steps: Load component
   * Expected Result: Placeholder text is displayed
   * Priority: Low
   */
  it('should display placeholder text', () => {
    render(<CreateTodo />);
    
    const input = screen.getByPlaceholderText(/What needs to be done/i);
    expect(input).toBeInTheDocument();
  });
});
