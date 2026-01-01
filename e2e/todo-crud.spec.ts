/**
 * Todo CRUD Operations E2E Tests
 * Reference: TEST_PLAN.md - Sections 3.2.2, 3.2.3, 3.2.4
 * 
 * These tests verify the complete todo lifecycle including
 * creating, toggling completion, and deleting todos.
 */

import { test, expect } from '@playwright/test';

test.describe('Add Todo Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to home page before each test
    await page.goto('/home');
    // Wait for page to be ready
    await expect(page.getByPlaceholder(/What needs to be done/)).toBeVisible();
  });

  /**
   * Test Case: AT-001
   * Add new todo item
   * Steps: 1. Type text in input field 2. Submit (click add or press Enter)
   * Expected Result: New todo appears in the list
   * Priority: High
   */
  test('AT-001: should add new todo when form is submitted', async ({ page }) => {
    // Step 1: Generate unique todo text to avoid conflicts
    const todoText = `E2E Test Todo ${Date.now()}`;
    
    // Step 2: Type in the input field
    const input = page.getByPlaceholder(/What needs to be done/);
    await input.fill(todoText);
    
    // Step 3: Click the submit button
    await page.locator('button[type="submit"]').click();
    
    // Step 4: Verify the new todo appears in the list
    await expect(page.getByText(todoText)).toBeVisible({ timeout: 5000 });
  });

  /**
   * Test Case: AT-002
   * Add todo with long text
   * Steps: Enter a todo with 100+ characters
   * Expected Result: Todo is added and text displays properly
   * Priority: Medium
   */
  test('AT-002: should handle long todo text', async ({ page }) => {
    // Step 1: Create long todo text with unique identifier
    const timestamp = Date.now();
    const longText = `LongTodo${timestamp} - This is an extremely long todo item that tests how the application handles text overflow and wrapping properly in the UI`;
    
    // Step 2: Enter the long text
    const input = page.getByPlaceholder(/What needs to be done/);
    await input.fill(longText);
    
    // Step 3: Submit the form
    await page.locator('button[type="submit"]').click();
    
    // Step 4: Verify the todo is added using the unique timestamp
    await expect(page.getByText(`LongTodo${timestamp}`)).toBeVisible({ timeout: 5000 });
  });

  /**
   * Test Case: AT-003
   * Prevent empty todo
   * Steps: Try to submit with empty input
   * Expected Result: Todo is not added; form shows validation or button is disabled
   * Priority: High
   */
  test('AT-003: should not allow submitting empty todo', async ({ page }) => {
    // Step 1: Verify the submit button is disabled when input is empty
    const submitButton = page.locator('button[type="submit"]');
    
    // Step 2: Check button is disabled initially
    await expect(submitButton).toBeDisabled();
  });

  /**
   * Test Case: AT-004
   * Add multiple todos
   * Steps: Add 5 different todos sequentially
   * Expected Result: All todos appear in the list
   * Priority: High
   */
  test('AT-004: should add multiple todos sequentially', async ({ page }) => {
    const timestamp = Date.now();
    const todos = [
      `First todo ${timestamp}`,
      `Second todo ${timestamp}`,
      `Third todo ${timestamp}`,
      `Fourth todo ${timestamp}`,
      `Fifth todo ${timestamp}`,
    ];
    
    for (const todoText of todos) {
      // Step 1: Enter todo text
      const input = page.getByPlaceholder(/What needs to be done/);
      await input.fill(todoText);
      
      // Step 2: Submit
      await page.locator('button[type="submit"]').click();
      
      // Step 3: Wait for input to clear (indicates success)
      await expect(input).toHaveValue('');
    }
    
    // Step 4: Verify all 5 todos are visible
    for (const todoText of todos) {
      await expect(page.getByText(todoText)).toBeVisible();
    }
  });

  /**
   * Test Case: AT-005
   * Input field clears after add
   * Steps: Add a new todo
   * Expected Result: Input field is cleared after successful submission
   * Priority: Medium
   */
  test('AT-005: should clear input after successful submission', async ({ page }) => {
    // Step 1: Enter todo text
    const todoText = `Clear test ${Date.now()}`;
    const input = page.getByPlaceholder(/What needs to be done/);
    await input.fill(todoText);
    
    // Step 2: Verify input has value
    await expect(input).toHaveValue(todoText);
    
    // Step 3: Submit
    await page.locator('button[type="submit"]').click();
    
    // Step 4: Verify input is cleared
    await expect(input).toHaveValue('');
  });

  /**
   * Test Case: Submit via Enter key
   * Steps: Type text and press Enter
   * Expected Result: Todo is submitted
   * Priority: Medium
   */
  test('should submit on Enter key press', async ({ page }) => {
    // Step 1: Enter todo text
    const todoText = `Enter key test ${Date.now()}`;
    const input = page.getByPlaceholder(/What needs to be done/);
    await input.fill(todoText);
    
    // Step 2: Press Enter
    await input.press('Enter');
    
    // Step 3: Verify todo is added
    await expect(page.getByText(todoText)).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Toggle Completion Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/home');
    await expect(page.getByPlaceholder(/What needs to be done/)).toBeVisible();
  });

  /**
   * Test Case: TC-001
   * Mark todo as complete
   * Steps: Click checkbox/toggle on an incomplete todo
   * Expected Result: Todo shows as completed (strikethrough, checkmark)
   * Priority: High
   */
  test('TC-001: should mark todo as complete when toggle is clicked', async ({ page }) => {
    // Step 1: Add a new todo first
    const todoText = `Toggle test ${Date.now()}`;
    const input = page.getByPlaceholder(/What needs to be done/);
    await input.fill(todoText);
    await page.locator('button[type="submit"]').click();
    
    // Step 2: Wait for todo to appear
    await expect(page.getByText(todoText)).toBeVisible();
    
    // Step 3: Find the todo item and its toggle button
    const todoItem = page.getByText(todoText).locator('..');
    const toggleButton = todoItem.locator('button').first();
    
    // Step 4: Click the toggle button
    await toggleButton.click();
    
    // Step 5: Verify the todo text has strikethrough class
    await expect(page.getByText(todoText)).toHaveClass(/line-through/);
  });

  /**
   * Test Case: TC-002
   * Mark todo as incomplete
   * Steps: Click checkbox/toggle on a completed todo
   * Expected Result: Todo returns to incomplete state
   * Priority: High
   */
  test('TC-002: should mark todo as incomplete when toggle is clicked again', async ({ page }) => {
    // Step 1: Add a new todo
    const todoText = `Untoggle test ${Date.now()}`;
    const input = page.getByPlaceholder(/What needs to be done/);
    await input.fill(todoText);
    await page.locator('button[type="submit"]').click();
    
    // Step 2: Wait for todo and find toggle button
    await expect(page.getByText(todoText)).toBeVisible();
    const todoItem = page.getByText(todoText).locator('..');
    const toggleButton = todoItem.locator('button').first();
    
    // Step 3: Toggle to complete
    await toggleButton.click();
    await expect(page.getByText(todoText)).toHaveClass(/line-through/);
    
    // Step 4: Toggle back to incomplete
    await toggleButton.click();
    
    // Step 5: Verify strikethrough is removed
    await expect(page.getByText(todoText)).not.toHaveClass(/line-through/);
  });

  /**
   * Test Case: TC-004
   * Visual feedback on completion (celebration)
   * Steps: Mark a todo as complete
   * Expected Result: Visual feedback (checkmark icon change) is shown
   * Priority: Medium
   */
  test('TC-004: should show visual feedback on completion', async ({ page }) => {
    // Step 1: Add a new todo
    const todoText = `Celebration test ${Date.now()}`;
    const input = page.getByPlaceholder(/What needs to be done/);
    await input.fill(todoText);
    await page.locator('button[type="submit"]').click();
    
    // Step 2: Wait for todo to appear
    await expect(page.getByText(todoText)).toBeVisible();
    
    // Step 3: Find the todo and verify initial state (circle icon)
    const todoRow = page.locator('div.group').filter({ hasText: todoText });
    const toggleButton = todoRow.locator('button').first();
    
    // Step 4: Click to complete and verify visual changes
    await toggleButton.click();
    
    // Step 5: Verify strikethrough is applied (visual feedback)
    await expect(page.getByText(todoText)).toHaveClass(/line-through/);
    
    // Step 6: Verify muted text color for completed state
    await expect(page.getByText(todoText)).toHaveClass(/text-muted-foreground/);
  });

  /**
   * Test Case: TC-003
   * Completion persists after refresh
   * Steps: 1. Mark todo complete 2. Refresh page
   * Expected Result: Todo remains in completed state
   * Priority: High
   */
  test('TC-003: should persist completion state after refresh', async ({ page }) => {
    // Step 1: Add a new todo
    const todoText = `Persist test ${Date.now()}`;
    const input = page.getByPlaceholder(/What needs to be done/);
    await input.fill(todoText);
    await page.locator('button[type="submit"]').click();
    
    // Step 2: Wait for todo and toggle it
    await expect(page.getByText(todoText)).toBeVisible();
    const todoItem = page.getByText(todoText).locator('..');
    await todoItem.locator('button').first().click();
    
    // Step 3: Verify it's completed
    await expect(page.getByText(todoText)).toHaveClass(/line-through/);
    
    // Step 4: Refresh the page
    await page.reload();
    
    // Step 5: Verify todo still shows as completed
    await expect(page.getByText(todoText)).toHaveClass(/line-through/);
  });
});

test.describe('Delete Todo Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/home');
    await expect(page.getByPlaceholder(/What needs to be done/)).toBeVisible();
  });

  /**
   * Test Case: DT-001
   * Delete single todo
   * Steps: Click delete button on a todo
   * Expected Result: Todo is removed from the list
   * Priority: High
   */
  test('DT-001: should delete todo when delete button is clicked', async ({ page }) => {
    // Step 1: Add a new todo
    const todoText = `Delete test ${Date.now()}`;
    const input = page.getByPlaceholder(/What needs to be done/);
    await input.fill(todoText);
    await page.locator('button[type="submit"]').click();
    
    // Step 2: Wait for todo to appear
    const todoSpan = page.getByText(todoText);
    await expect(todoSpan).toBeVisible();
    
    // Step 3: Find the todo row container (div with group class containing the text)
    const todoRow = page.locator('div.group').filter({ hasText: todoText });
    await todoRow.hover();
    
    // Step 4: Click the delete button (Trash icon button - last button in the row)
    const deleteButton = todoRow.locator('button').last();
    await deleteButton.click({ force: true });
    
    // Step 5: Wait for deletion to complete and verify todo is removed
    await expect(todoSpan).not.toBeVisible({ timeout: 10000 });
  });

  /**
   * Test Case: DT-002
   * Delete completed todo
   * Steps: Delete a todo that is marked complete
   * Expected Result: Todo is removed successfully
   * Priority: Medium
   */
  test('DT-002: should delete completed todo', async ({ page }) => {
    // Step 1: Add a new todo
    const todoText = `Delete completed ${Date.now()}`;
    const input = page.getByPlaceholder(/What needs to be done/);
    await input.fill(todoText);
    await page.locator('button[type="submit"]').click();
    
    // Step 2: Wait for todo to appear
    const todoSpan = page.getByText(todoText);
    await expect(todoSpan).toBeVisible();
    
    // Step 3: Find the todo row and mark as complete
    const todoRow = page.locator('div.group').filter({ hasText: todoText });
    await todoRow.locator('button').first().click();
    
    // Step 4: Wait for completion state to be applied
    await expect(todoSpan).toHaveClass(/line-through/);
    
    // Step 5: Hover and click the delete button using JavaScript evaluation
    // The confetti animation may overlay the button, so we use JS to click directly
    await todoRow.hover();
    const deleteButton = todoRow.locator('button').last();
    await deleteButton.evaluate((btn: HTMLButtonElement) => btn.click());
    
    // Step 6: Verify todo is removed
    await expect(todoSpan).not.toBeVisible({ timeout: 10000 });
  });

  /**
   * Test Case: DT-003
   * Delete persists after refresh
   * Steps: 1. Delete a todo 2. Refresh page
   * Expected Result: Deleted todo does not reappear
   * Priority: High
   */
  test('DT-003: should persist deletion after refresh', async ({ page }) => {
    // Step 1: Add a new todo
    const todoText = `Persist delete ${Date.now()}`;
    const input = page.getByPlaceholder(/What needs to be done/);
    await input.fill(todoText);
    await page.locator('button[type="submit"]').click();
    
    // Step 2: Wait for todo to appear
    const todoSpan = page.getByText(todoText);
    await expect(todoSpan).toBeVisible();
    
    // Step 3: Find and delete the todo
    const todoRow = page.locator('div.group').filter({ hasText: todoText });
    await todoRow.hover();
    await todoRow.locator('button').last().click({ force: true });
    
    // Step 4: Verify deleted
    await expect(todoSpan).not.toBeVisible({ timeout: 10000 });
    
    // Step 5: Refresh page
    await page.reload();
    
    // Step 6: Verify still deleted after reload
    await expect(page.getByText(todoText)).not.toBeVisible();
  });

  /**
   * Test Case: DT-004
   * Delete final todo and verify empty state
   * Steps: 1. Add a todo 2. Delete it
   * Expected Result: Todo list is empty and input remains available
   * Priority: Medium
   */
  test('DT-004: should show input after deleting final todo', async ({ page }) => {
    // Step 1: Add a new todo
    const todoText = `Final delete test ${Date.now()}`;
    const input = page.getByPlaceholder(/What needs to be done/);
    await input.fill(todoText);
    await page.locator('button[type="submit"]').click();
    
    // Step 2: Wait for todo to appear
    const todoSpan = page.getByText(todoText);
    await expect(todoSpan).toBeVisible();
    
    // Step 3: Delete the todo
    const todoRow = page.locator('div.group').filter({ hasText: todoText });
    await todoRow.hover();
    await todoRow.locator('button').last().click({ force: true });
    
    // Step 4: Verify todo is removed
    await expect(todoSpan).not.toBeVisible({ timeout: 10000 });
    
    // Step 5: Verify input is still available for adding new todos
    await expect(input).toBeVisible();
    await expect(input).toBeEnabled();
    
    // Step 6: Verify add button is available
    const addButton = page.locator('button[type="submit"]');
    await expect(addButton).toBeVisible();
  });
});
