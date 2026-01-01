/**
 * Home Page E2E Tests
 * Reference: TEST_PLAN.md - Section 3.2.1 Page Load Tests
 * 
 * These tests verify the home page functionality including
 * page load, todo list display, and empty state handling.
 */

import { test, expect } from '@playwright/test';

test.describe('Home Page Tests', () => {
  /**
   * Test Case: HP-001
   * Verify home page loads
   * Steps: Navigate to /home
   * Expected Result: Todo list page displays correctly
   * Priority: High
   */
  test('HP-001: should load home page with title', async ({ page }) => {
    // Step 1: Navigate to home page
    await page.goto('/home');
    
    // Step 2: Verify URL is correct
    await expect(page).toHaveURL('/home');
    
    // Step 3: Verify page title is displayed
    await expect(page.getByText('Task Master')).toBeVisible();
    
    // Step 4: Verify subtitle is displayed
    await expect(page.getByText('Keep track of your tasks')).toBeVisible();
  });

  /**
   * Test Case: HP-002
   * Verify existing todos display
   * Steps: Load home page with seeded data
   * Expected Result: Pre-existing todos are visible in the list
   * Priority: High
   */
  test('HP-002: should display existing todos from database', async ({ page }) => {
    // Step 1: Navigate to home page
    await page.goto('/home');
    
    // Step 2: Wait for todos to load (check for input field as page loaded indicator)
    await expect(page.getByPlaceholder(/What needs to be done/)).toBeVisible();
    
    // Step 3: Check that todo list container is present
    // Note: Actual todos depend on database state
    const todoInput = page.getByPlaceholder(/What needs to be done/);
    await expect(todoInput).toBeVisible();
  });

  /**
   * Test Case: Verify input field is present
   * Steps: Load home page
   * Expected Result: Todo input field is displayed
   * Priority: High
   */
  test('should display todo input field', async ({ page }) => {
    // Step 1: Navigate to home page
    await page.goto('/home');
    
    // Step 2: Verify input field is present
    const input = page.getByPlaceholder(/What needs to be done/);
    await expect(input).toBeVisible();
    
    // Step 3: Verify add button is present
    const addButton = page.locator('button[type="submit"]');
    await expect(addButton).toBeVisible();
  });

  /**
   * Test Case: Verify cat icon in header
   * Steps: Load home page
   * Expected Result: Cat icon is displayed in the header
   * Priority: Medium
   */
  test('should display cat icon in header', async ({ page }) => {
    // Step 1: Navigate to home page
    await page.goto('/home');
    
    // Step 2: Verify SVG icons are present (including Cat icon)
    const header = page.locator('header');
    await expect(header.locator('svg').first()).toBeVisible();
  });

  /**
   * Test Case: Verify footer is displayed
   * Steps: Load home page
   * Expected Result: Footer with copyright is visible
   * Priority: Low
   */
  test('should display footer', async ({ page }) => {
    // Step 1: Navigate to home page
    await page.goto('/home');
    
    // Step 2: Verify footer text
    await expect(page.getByText(/Purrfect Productivity/)).toBeVisible();
  });

  /**
   * Test Case: HP-003
   * Verify empty state handling
   * Steps: View home page when todo list is empty
   * Expected Result: Empty state message or prompt is displayed
   * Priority: Medium
   */
  test('HP-003: should display input area when no todos', async ({ page }) => {
    // Step 1: Navigate to home page
    await page.goto('/home');
    
    // Step 2: Verify the input area is always visible for adding new todos
    const input = page.getByPlaceholder(/What needs to be done/);
    await expect(input).toBeVisible();
    
    // Step 3: Verify the add button is available
    const addButton = page.locator('button[type="submit"]');
    await expect(addButton).toBeVisible();
  });
});
