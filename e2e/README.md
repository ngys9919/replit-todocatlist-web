# Playwright E2E Tests

## Overview

This directory contains End-to-End (E2E) tests for the Todo Checklist Web Application using Playwright.

## Test Files Structure

```
e2e/
├── README.md           # This documentation
├── landing.spec.ts     # Landing page tests (LP-001 to LP-006)
├── home.spec.ts        # Home page tests (HP-001 to HP-003)
├── todo-crud.spec.ts   # Todo CRUD tests (AT-001 to AT-005, TC-001 to TC-003, DT-001 to DT-003)
├── navigation.spec.ts  # Navigation tests (NV-001 to NV-004)
└── responsive.spec.ts  # Responsive design tests (RD-001 to RD-004)
```

## Test Case Reference

Each test file contains tests that map to the test cases defined in `TEST_PLAN.md`:

| File | Test Cases Covered | Description |
|------|-------------------|-------------|
| `landing.spec.ts` | LP-001 to LP-006 | Landing page load, welcome message, navigation |
| `home.spec.ts` | HP-001 to HP-003 | Home page load, todo display, empty state |
| `todo-crud.spec.ts` | AT-001 to AT-005, TC-001 to TC-003, DT-001 to DT-003 | Add, toggle, delete todos |
| `navigation.spec.ts` | NV-001 to NV-004 | Page navigation, 404 handling, browser history |
| `responsive.spec.ts` | RD-001 to RD-004 | Desktop, tablet, mobile layouts |

## Running Tests

### Prerequisites

1. Install Playwright browsers:
   ```bash
   npx playwright install chromium
   ```

2. Ensure the development server is running:
   ```bash
   npm run dev
   ```

### Run All Tests

```bash
npx playwright test
```

### Run Specific Test File

```bash
# Run landing page tests only
npx playwright test e2e/landing.spec.ts

# Run navigation tests only
npx playwright test e2e/navigation.spec.ts
```

### Run Tests in Headed Mode (See Browser)

```bash
npx playwright test --headed
```

### Run Tests with UI Mode

```bash
npx playwright test --ui
```

### Debug a Specific Test

```bash
npx playwright test --debug e2e/landing.spec.ts
```

### Generate Test Report

After running tests, view the HTML report:
```bash
npx playwright show-report
```

## Configuration

The Playwright configuration is in `playwright.config.ts` at the project root:

- **Base URL**: `http://localhost:5000`
- **Browsers**: Chromium (Desktop and Mobile)
- **Screenshots**: On failure only
- **Traces**: On first retry
- **Retries**: 0 locally, 2 on CI

## Writing New Tests

### Test Structure Template

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  /**
   * Test Case: XX-NNN
   * Description from TEST_PLAN.md
   * Steps: ...
   * Expected Result: ...
   * Priority: High/Medium/Low
   */
  test('XX-NNN: descriptive test name', async ({ page }) => {
    // Step 1: Navigate/Setup
    await page.goto('/path');
    
    // Step 2: Perform action
    await page.getByRole('button', { name: /click me/i }).click();
    
    // Step 3: Assert result
    await expect(page.getByText('Expected Text')).toBeVisible();
  });
});
```

### Best Practices

1. **Use data-testid for stable selectors**:
   ```typescript
   await page.locator('[data-testid="submit-button"]').click();
   ```

2. **Avoid manual waits**:
   ```typescript
   // ✅ Good - auto-waits
   await expect(page.getByText('Success')).toBeVisible();
   
   // ❌ Avoid
   await page.waitForTimeout(3000);
   ```

3. **Use unique test data**:
   ```typescript
   const todoText = `Test todo ${Date.now()}`;
   ```

4. **Document test case references**:
   ```typescript
   /**
    * Test Case: AT-001
    * Reference: TEST_PLAN.md - Section 3.2.2
    */
   ```

## Test Categories

### 1. Landing Page Tests (LP-xxx)
- Page load verification
- Welcome message display
- Get Started button functionality
- Cat icon visibility
- Responsive layout

### 2. Home Page Tests (HP-xxx)
- Page load with title
- Todo list display
- Empty state handling
- Loading state

### 3. Add Todo Tests (AT-xxx)
- Add single todo
- Add todo with long text
- Prevent empty todo
- Add multiple todos
- Input field clearing

### 4. Toggle Completion Tests (TC-xxx)
- Mark todo complete
- Mark todo incomplete
- Persistence after refresh

### 5. Delete Todo Tests (DT-xxx)
- Delete single todo
- Delete completed todo
- Persistence after refresh

### 6. Navigation Tests (NV-xxx)
- Landing to home navigation
- Direct URL access
- 404 page handling
- Browser history (back/forward)

### 7. Responsive Design Tests (RD-xxx)
- Desktop layout (1920x1080)
- Tablet layout (768x1024)
- Mobile layout (375x667)
- Touch interactions

## Troubleshooting

### Tests fail to start
- Ensure the dev server is running on port 5000
- Check that Playwright browsers are installed

### Tests are flaky
- Increase timeouts for network-dependent tests
- Use more specific selectors
- Avoid hardcoded waits

### Screenshots/traces not generated
- Check the `playwright.config.ts` settings
- Ensure `output` directory has write permissions
