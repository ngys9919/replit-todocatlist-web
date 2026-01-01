/**
 * Home Page Tests
 * Reference: TEST_PLAN.md - Section 3.2.1 Page Load Tests
 */

import { describe, it, expect, vi, beforeAll, afterAll, afterEach } from 'vitest';
import { render, screen, waitFor } from './test-utils';
import Home from '@/pages/Home';
import { server } from './mocks/server';
import { resetTodos } from './mocks/handlers';
import { http, HttpResponse } from 'msw';
import { api } from '@shared/routes';

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

// Reset handlers after each test
afterEach(() => {
  server.resetHandlers();
  resetTodos();
});

// Close server after all tests
afterAll(() => server.close());

describe('Home Page Tests', () => {
  /**
   * Test Case: HP-001
   * Verify home page loads
   * Steps: Navigate to /home
   * Expected Result: Todo list page displays correctly
   * Priority: High
   */
  it('HP-001: should render home page with title', async () => {
    render(<Home />);
    
    // Check for page title
    expect(screen.getByText(/Task Master/i)).toBeInTheDocument();
    expect(screen.getByText(/Keep track of your tasks/i)).toBeInTheDocument();
  });

  /**
   * Test Case: HP-002
   * Verify existing todos display
   * Steps: Load home page with seeded data
   * Expected Result: Pre-existing todos are visible in the list
   * Priority: High
   */
  it('HP-002: should display existing todos from API', async () => {
    render(<Home />);
    
    // Wait for todos to load
    await waitFor(() => {
      expect(screen.getByText('Buy groceries')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Complete project report')).toBeInTheDocument();
    expect(screen.getByText('Call mom')).toBeInTheDocument();
  });

  /**
   * Test Case: HP-003
   * Verify empty state
   * Steps: Load page with no todos
   * Expected Result: Empty state message or placeholder is shown
   * Priority: Medium
   */
  it('HP-003: should display empty state when no todos', async () => {
    // Override handler to return empty array
    server.use(
      http.get(api.todos.list.path, () => {
        return HttpResponse.json([]);
      })
    );
    
    render(<Home />);
    
    // Wait for empty state to appear
    await waitFor(() => {
      expect(screen.getByText(/All caught up!/i)).toBeInTheDocument();
    });
    
    expect(screen.getByText(/Time for a cat nap/i)).toBeInTheDocument();
  });

  /**
   * Test Case: Verify loading state
   * Steps: Load home page
   * Expected Result: Loading indicator shown while fetching data
   * Priority: Medium
   */
  it('should show loading state while fetching todos', () => {
    // Add delay to API response
    server.use(
      http.get(api.todos.list.path, async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
        return HttpResponse.json([]);
      })
    );
    
    render(<Home />);
    
    // Check for loading skeleton elements
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  /**
   * Test Case: Verify cat icon in header
   * Steps: Load home page
   * Expected Result: Cat icon is displayed in the header
   * Priority: Medium
   */
  it('should display cat icon in header', () => {
    render(<Home />);
    
    // Cat icon should be present
    const catIcons = document.querySelectorAll('svg');
    expect(catIcons.length).toBeGreaterThan(0);
  });

  /**
   * Test Case: Verify footer is displayed
   * Steps: Load home page
   * Expected Result: Footer with copyright is visible
   * Priority: Low
   */
  it('should display footer', () => {
    render(<Home />);
    
    expect(screen.getByText(/Purrfect Productivity/i)).toBeInTheDocument();
  });
});
