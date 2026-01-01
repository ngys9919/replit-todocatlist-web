/**
 * Landing Page E2E Tests
 * Reference: TEST_PLAN.md - Section 3.1 Landing Page Tests
 * 
 * These tests verify the landing page functionality including
 * page load, welcome message, navigation, and responsive design.
 */

import { test, expect } from '@playwright/test';

test.describe('Landing Page Tests', () => {
  /**
   * Test Case: LP-001
   * Verify landing page loads
   * Steps: Navigate to root URL (/)
   * Expected Result: Page displays welcome message and cat logo
   * Priority: High
   */
  test('LP-001: should load landing page with welcome content', async ({ page }) => {
    // Step 1: Navigate to root URL
    await page.goto('/');
    
    // Step 2: Verify page loads successfully
    await expect(page).toHaveURL('/');
    
    // Step 3: Verify welcome content is displayed
    await expect(page.getByText('Get things done')).toBeVisible();
    await expect(page.getByText('right meow')).toBeVisible();
  });

  /**
   * Test Case: LP-002
   * Verify welcome message
   * Steps: Load landing page
   * Expected Result: Welcome/intro text is visible and properly styled
   * Priority: High
   */
  test('LP-002: should display welcome/intro message', async ({ page }) => {
    // Step 1: Navigate to landing page
    await page.goto('/');
    
    // Step 2: Verify intro badge text
    await expect(page.getByText('Productivity made playful')).toBeVisible();
    
    // Step 3: Verify description text
    await expect(page.getByText(/The simplest, cutest way to manage your daily tasks/)).toBeVisible();
  });

  /**
   * Test Case: LP-003
   * Verify "Go" button visibility (implemented as "Get Started")
   * Steps: Load landing page
   * Expected Result: "Get Started" button is visible and clickable
   * Priority: High
   */
  test('LP-003: should display Get Started button', async ({ page }) => {
    // Step 1: Navigate to landing page
    await page.goto('/');
    
    // Step 2: Locate the Get Started button
    const button = page.getByRole('button', { name: /get started/i });
    
    // Step 3: Verify button is visible
    await expect(button).toBeVisible();
    
    // Step 4: Verify button is enabled (clickable)
    await expect(button).toBeEnabled();
  });

  /**
   * Test Case: LP-004
   * Verify "Go" button navigation
   * Steps: Click the "Get Started" button
   * Expected Result: User is redirected to /home page
   * Priority: High
   */
  test('LP-004: should navigate to /home when Get Started is clicked', async ({ page }) => {
    // Step 1: Navigate to landing page
    await page.goto('/');
    
    // Step 2: Click the Get Started button
    await page.getByRole('button', { name: /get started/i }).click();
    
    // Step 3: Verify navigation to /home
    await expect(page).toHaveURL('/home');
    
    // Step 4: Verify home page content is visible
    await expect(page.getByText('Task Master')).toBeVisible();
  });

  /**
   * Test Case: LP-005
   * Verify cat icon display
   * Steps: Load landing page
   * Expected Result: Cat face icon is visible in the UI
   * Priority: Medium
   */
  test('LP-005: should display cat icon', async ({ page }) => {
    // Step 1: Navigate to landing page
    await page.goto('/');
    
    // Step 2: Verify SVG icons are present (Cat icon from lucide-react)
    const svgIcons = page.locator('svg');
    await expect(svgIcons.first()).toBeVisible();
  });

  /**
   * Test Case: LP-006
   * Verify responsive layout
   * Steps: Resize browser to mobile width
   * Expected Result: Page elements stack properly and remain usable
   * Priority: Medium
   */
  test('LP-006: should be responsive on mobile viewport', async ({ page }) => {
    // Step 1: Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Step 2: Navigate to landing page
    await page.goto('/');
    
    // Step 3: Verify main content is visible
    await expect(page.getByText('Get things done')).toBeVisible();
    
    // Step 4: Verify Get Started button is visible and clickable
    const button = page.getByRole('button', { name: /get started/i });
    await expect(button).toBeVisible();
    
    // Step 5: Click button and verify navigation works
    await button.click();
    await expect(page).toHaveURL('/home');
  });

  /**
   * Additional Test: Verify feature highlights are displayed
   * Steps: Load landing page
   * Expected Result: Feature list is visible
   * Priority: Low
   */
  test('should display feature highlights', async ({ page }) => {
    // Step 1: Navigate to landing page
    await page.goto('/');
    
    // Step 2: Verify feature highlights
    await expect(page.getByText('Free forever')).toBeVisible();
    await expect(page.getByText('No login needed')).toBeVisible();
    await expect(page.getByText('Purrfectly simple')).toBeVisible();
  });
});
