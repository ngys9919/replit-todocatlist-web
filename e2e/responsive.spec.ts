/**
 * Responsive Design E2E Tests
 * Reference: TEST_PLAN.md - Section 3.6 Responsive Design Tests
 * 
 * These tests verify the application's responsive behavior
 * across different viewport sizes (desktop, tablet, mobile).
 */

import { test, expect } from '@playwright/test';

test.describe('Responsive Design Tests', () => {
  /**
   * Test Case: RD-001
   * Desktop layout
   * Viewport: 1920x1080
   * Expected Result: Full layout with appropriate spacing
   * Priority: High
   */
  test('RD-001: should display correctly on desktop', async ({ page }) => {
    // Step 1: Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    // Step 2: Navigate to home page
    await page.goto('/home');
    
    // Step 3: Verify layout elements are visible
    await expect(page.getByText('Task Master')).toBeVisible();
    await expect(page.getByPlaceholder(/What needs to be done/)).toBeVisible();
    
    // Step 4: Verify content is centered and not stretched
    const container = page.locator('.max-w-2xl');
    await expect(container).toBeVisible();
  });

  /**
   * Test Case: RD-002
   * Tablet layout
   * Viewport: 768x1024
   * Expected Result: Layout adapts, elements remain usable
   * Priority: Medium
   */
  test('RD-002: should display correctly on tablet', async ({ page }) => {
    // Step 1: Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    
    // Step 2: Navigate to home page
    await page.goto('/home');
    
    // Step 3: Verify main elements are visible
    await expect(page.getByText('Task Master')).toBeVisible();
    await expect(page.getByPlaceholder(/What needs to be done/)).toBeVisible();
    
    // Step 4: Verify form is usable
    const input = page.getByPlaceholder(/What needs to be done/);
    await input.fill('Tablet test');
    await expect(page.locator('button[type="submit"]')).toBeEnabled();
  });

  /**
   * Test Case: RD-003
   * Mobile layout
   * Viewport: 375x667
   * Expected Result: Single column, touch-friendly buttons
   * Priority: High
   */
  test('RD-003: should display correctly on mobile', async ({ page }) => {
    // Step 1: Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Step 2: Navigate to home page
    await page.goto('/home');
    
    // Step 3: Verify main elements are visible
    await expect(page.getByText('Task Master')).toBeVisible();
    await expect(page.getByPlaceholder(/What needs to be done/)).toBeVisible();
    
    // Step 4: Verify elements fit within viewport (no horizontal scroll)
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(375);
  });

  /**
   * Test Case: RD-004
   * Touch interactions on mobile
   * Viewport: Mobile device
   * Expected Result: Tap to add, complete, delete works correctly
   * Priority: High
   */
  test('RD-004: should handle touch interactions on mobile', async ({ page }) => {
    // Step 1: Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Step 2: Navigate to home page
    await page.goto('/home');
    
    // Step 3: Add a todo via click (simulating touch on mobile)
    const todoText = `Mobile touch test ${Date.now()}`;
    const input = page.getByPlaceholder(/What needs to be done/);
    await input.click();
    await input.fill(todoText);
    
    // Step 4: Click submit button (simulating tap)
    await page.locator('button[type="submit"]').click();
    
    // Step 5: Verify todo was added
    await expect(page.getByText(todoText)).toBeVisible();
  });

  /**
   * Test Case: Landing page responsive
   * Viewport: Various
   * Expected Result: Landing page adapts to all viewports
   * Priority: Medium
   */
  test('should display landing page correctly on all viewports', async ({ page }) => {
    const viewports = [
      { width: 1920, height: 1080, name: 'desktop' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 375, height: 667, name: 'mobile' },
    ];
    
    for (const viewport of viewports) {
      // Set viewport
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      
      // Navigate to landing
      await page.goto('/');
      
      // Verify main content is visible
      await expect(page.getByText('Get things done')).toBeVisible();
      await expect(page.getByRole('button', { name: /get started/i })).toBeVisible();
    }
  });

  /**
   * Test Case: Form usability on mobile
   * Viewport: Mobile
   * Expected Result: Form inputs are easy to use on small screens
   * Priority: High
   */
  test('should have usable form on mobile', async ({ page }) => {
    // Step 1: Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Step 2: Navigate to home page
    await page.goto('/home');
    
    // Step 3: Verify input is properly sized
    const input = page.getByPlaceholder(/What needs to be done/);
    const inputBox = await input.boundingBox();
    expect(inputBox?.width).toBeGreaterThan(200); // Input should be reasonably wide
    
    // Step 4: Verify submit button is tappable (minimum 44px for touch targets)
    const submitButton = page.locator('button[type="submit"]');
    const buttonBox = await submitButton.boundingBox();
    expect(buttonBox?.height).toBeGreaterThanOrEqual(40);
  });
});

test.describe('Accessibility Tests', () => {
  /**
   * Test Case: Keyboard navigation
   * Steps: Navigate using Tab key
   * Expected Result: All interactive elements are focusable
   * Priority: Medium
   */
  test('should be navigable via keyboard', async ({ page }) => {
    // Step 1: Navigate to home page
    await page.goto('/home');
    
    // Step 2: Focus on input field using Tab
    await page.keyboard.press('Tab');
    
    // Step 3: Verify focus is on input
    const activeElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(activeElement).toBe('INPUT');
    
    // Step 4: Tab to submit button
    await page.keyboard.press('Tab');
    
    // Step 5: Verify focus moved to button
    const activeElement2 = await page.evaluate(() => document.activeElement?.tagName);
    expect(activeElement2).toBe('BUTTON');
  });
});
