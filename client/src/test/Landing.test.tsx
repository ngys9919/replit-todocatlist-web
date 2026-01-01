/**
 * Landing Page Tests
 * Reference: TEST_PLAN.md - Section 3.1 Landing Page Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from './test-utils';
import userEvent from '@testing-library/user-event';
import Landing from '@/pages/Landing';

// Mock wouter's Link and useLocation
const mockNavigate = vi.fn();
vi.mock('wouter', () => ({
  Link: ({ href, children, className }: any) => (
    <a href={href} className={className} onClick={(e) => { e.preventDefault(); mockNavigate(href); }}>
      {children}
    </a>
  ),
  useLocation: () => ['/', mockNavigate],
}));

describe('Landing Page Tests', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  /**
   * Test Case: LP-001
   * Verify landing page loads
   * Steps: Navigate to root URL (/)
   * Expected Result: Page displays welcome message and cat logo
   * Priority: High
   */
  it('LP-001: should render landing page with welcome content', () => {
    render(<Landing />);
    
    // Check for main heading content
    expect(screen.getByText(/Get things done/i)).toBeInTheDocument();
    expect(screen.getByText(/right meow/i)).toBeInTheDocument();
  });

  /**
   * Test Case: LP-002
   * Verify welcome message
   * Steps: Load landing page
   * Expected Result: Welcome/intro text is visible and properly styled
   * Priority: High
   */
  it('LP-002: should display welcome/intro message', () => {
    render(<Landing />);
    
    // Check for intro text
    expect(screen.getByText(/Productivity made playful/i)).toBeInTheDocument();
    expect(screen.getByText(/The simplest, cutest way to manage your daily tasks/i)).toBeInTheDocument();
  });

  /**
   * Test Case: LP-003
   * Verify "Go" button visibility (renamed to "Get Started" in implementation)
   * Steps: Load landing page
   * Expected Result: "Get Started" button is visible and clickable
   * Priority: High
   */
  it('LP-003: should display Get Started button', () => {
    render(<Landing />);
    
    const button = screen.getByRole('button', { name: /get started/i });
    expect(button).toBeInTheDocument();
    expect(button).toBeEnabled();
  });

  /**
   * Test Case: LP-004
   * Verify "Go" button navigation
   * Steps: Click the "Get Started" button
   * Expected Result: User is redirected to /home page
   * Priority: High
   */
  it('LP-004: should navigate to /home when Get Started button is clicked', async () => {
    const user = userEvent.setup();
    render(<Landing />);
    
    const link = screen.getByRole('link');
    await user.click(link);
    
    expect(mockNavigate).toHaveBeenCalledWith('/home');
  });

  /**
   * Test Case: LP-005
   * Verify cat icon display
   * Steps: Load landing page
   * Expected Result: Cat face icon is visible in the UI
   * Priority: Medium
   */
  it('LP-005: should display cat icon', () => {
    render(<Landing />);
    
    // The Cat icon from lucide-react renders as an SVG
    // Check for the icon's parent container or the SVG element
    const catIcons = document.querySelectorAll('svg');
    expect(catIcons.length).toBeGreaterThan(0);
  });

  /**
   * Test Case: LP-006
   * Verify responsive layout elements are present
   * Steps: Load landing page
   * Expected Result: Page elements stack properly and remain usable
   * Priority: Medium
   */
  it('LP-006: should have responsive layout classes', () => {
    render(<Landing />);
    
    // Check for responsive grid layout
    const gridContainer = document.querySelector('.grid');
    expect(gridContainer).toBeInTheDocument();
    expect(gridContainer).toHaveClass('grid-cols-1', 'lg:grid-cols-2');
  });

  /**
   * Additional Test: Verify feature list is displayed
   * Steps: Load landing page
   * Expected Result: Feature highlights are shown
   * Priority: Low
   */
  it('should display feature highlights', () => {
    render(<Landing />);
    
    expect(screen.getByText(/Free forever/i)).toBeInTheDocument();
    expect(screen.getByText(/No login needed/i)).toBeInTheDocument();
    expect(screen.getByText(/Purrfectly simple/i)).toBeInTheDocument();
  });
});
