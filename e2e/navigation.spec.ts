/**
 * Navigation E2E Tests
 * Reference: TEST_PLAN.md - Section 3.3 Navigation Tests
 * 
 * These tests verify navigation between pages, URL handling,
 * and 404 page behavior.
 */

import { test, expect } from '@playwright/test';

test.describe('Navigation Tests', () => {
  /**
   * Test Case: NV-001
   * Navigate from landing to home
   * Steps: Click "Go" button on landing page
   * Expected Result: User arrives at /home with todo list
   * Priority: High
   */
  test('NV-001: should navigate from landing to home page', async ({ page }) => {
    // Step 1: Navigate to landing page
    await page.goto('/');
    
    // Step 2: Verify we're on landing page
    await expect(page.getByText('Get things done')).toBeVisible();
    
    // Step 3: Click the Get Started button
    await page.getByRole('button', { name: /get started/i }).click();
    
    // Step 4: Verify navigation to home
    await expect(page).toHaveURL('/home');
    
    // Step 5: Verify home page content
    await expect(page.getByText('Task Master')).toBeVisible();
    await expect(page.getByPlaceholder(/What needs to be done/)).toBeVisible();
  });

  /**
   * Test Case: NV-002
   * Direct URL access to home
   * Steps: Type /home directly in browser
   * Expected Result: Home page loads correctly
   * Priority: Medium
   */
  test('NV-002: should access home page directly via URL', async ({ page }) => {
    // Step 1: Navigate directly to /home
    await page.goto('/home');
    
    // Step 2: Verify URL is correct
    await expect(page).toHaveURL('/home');
    
    // Step 3: Verify page loads correctly
    await expect(page.getByText('Task Master')).toBeVisible();
    await expect(page.getByPlaceholder(/What needs to be done/)).toBeVisible();
  });

  /**
   * Test Case: NV-003
   * Handle invalid route
   * Steps: Navigate to non-existent URL (e.g., /xyz)
   * Expected Result: 404 Not Found page is displayed
   * Priority: Medium
   */
  test('NV-003: should display 404 page for invalid routes', async ({ page }) => {
    // Step 1: Navigate to non-existent URL
    await page.goto('/this-page-does-not-exist');
    
    // Step 2: Verify 404 page is displayed
    await expect(page.getByText('404 Page Not Found')).toBeVisible();
  });

  /**
   * Test Case: NV-004
   * Browser back button
   * Steps: 1. Go to landing 2. Click Go 3. Click browser back
   * Expected Result: Returns to landing page
   * Priority: Low
   */
  test('NV-004: should handle browser back button', async ({ page }) => {
    // Step 1: Navigate to landing page
    await page.goto('/');
    
    // Step 2: Click Get Started to go to home
    await page.getByRole('button', { name: /get started/i }).click();
    await expect(page).toHaveURL('/home');
    
    // Step 3: Use browser back button
    await page.goBack();
    
    // Step 4: Verify we're back on landing page
    await expect(page).toHaveURL('/');
    await expect(page.getByText('Get things done')).toBeVisible();
  });

  /**
   * Test Case: Direct URL access to landing
   * Steps: Navigate to root URL
   * Expected Result: Landing page loads
   * Priority: High
   */
  test('should access landing page at root URL', async ({ page }) => {
    // Step 1: Navigate to root
    await page.goto('/');
    
    // Step 2: Verify landing page content
    await expect(page.getByText('Get things done')).toBeVisible();
    await expect(page.getByRole('button', { name: /get started/i })).toBeVisible();
  });

  /**
   * Test Case: Browser forward button
   * Steps: 1. Go to landing 2. Go to home 3. Go back 4. Go forward
   * Expected Result: Forward button works correctly
   * Priority: Low
   */
  test('should handle browser forward button', async ({ page }) => {
    // Step 1: Navigate to landing
    await page.goto('/');
    
    // Step 2: Go to home
    await page.getByRole('button', { name: /get started/i }).click();
    await expect(page).toHaveURL('/home');
    
    // Step 3: Go back to landing
    await page.goBack();
    await expect(page).toHaveURL('/');
    
    // Step 4: Go forward to home
    await page.goForward();
    await expect(page).toHaveURL('/home');
    await expect(page.getByText('Task Master')).toBeVisible();
  });
});
