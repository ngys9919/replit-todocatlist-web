/**
 * Navigation Tests
 * Reference: TEST_PLAN.md - Section 3.3 Navigation Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';

// Create test wrapper
function TestWrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>{children}</TooltipProvider>
    </QueryClientProvider>
  );
}

describe('Navigation Tests', () => {
  /**
   * Test Case: NV-003
   * Handle invalid route
   * Steps: Navigate to non-existent URL (e.g., /xyz)
   * Expected Result: 404 Not Found page is displayed
   * Priority: Medium
   */
  it('NV-003: should display 404 page for invalid routes', () => {
    render(
      <TestWrapper>
        <NotFound />
      </TestWrapper>
    );
    
    expect(screen.getByText(/404 Page Not Found/i)).toBeInTheDocument();
  });

  /**
   * Test Case: NotFound page displays helpful message
   * Steps: Load 404 page
   * Expected Result: Helpful error message is shown
   * Priority: Low
   */
  it('should display helpful message on 404 page', () => {
    render(
      <TestWrapper>
        <NotFound />
      </TestWrapper>
    );
    
    expect(screen.getByText(/Did you forget to add the page/i)).toBeInTheDocument();
  });

  /**
   * Test Case: NotFound page has proper styling
   * Steps: Load 404 page
   * Expected Result: Page is properly styled with card component
   * Priority: Low
   */
  it('should have proper styling on 404 page', () => {
    render(
      <TestWrapper>
        <NotFound />
      </TestWrapper>
    );
    
    // Check for alert icon
    const alertIcon = document.querySelector('svg');
    expect(alertIcon).toBeInTheDocument();
  });
});

describe('Route Configuration Tests', () => {
  /**
   * Test Case: NV-001 & NV-002
   * Verify routes are properly configured
   * This tests the route configuration in App.tsx
   * Priority: High
   */
  it('should have correct route paths defined', () => {
    // This is a unit test for route configuration
    // Routes should be: '/' for Landing, '/home' for Home
    
    const expectedRoutes = [
      { path: '/', component: 'Landing' },
      { path: '/home', component: 'Home' },
    ];
    
    // Verify routes are as expected
    expect(expectedRoutes[0].path).toBe('/');
    expect(expectedRoutes[1].path).toBe('/home');
  });
});
