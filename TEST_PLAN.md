# Test Plan - Todo Checklist Web Application

## 1. Overview

This document outlines the test plan and test cases for the Todo Checklist Web Application. The application consists of a landing page with navigation and a home page featuring a fully functional todo checklist.

---

## 2. Test Environment

- **Browser Support**: Chrome, Firefox, Safari, Edge (latest versions)
- **Responsive Testing**: Desktop (1920x1080, 1366x768), Tablet (768x1024), Mobile (375x667)
- **Database**: PostgreSQL

---

## 3. Test Cases

### 3.1 Landing Page Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| LP-001 | Verify landing page loads | Navigate to root URL (/) | Page displays welcome message and cat logo | High |
| LP-002 | Verify welcome message | Load landing page | "Welcome" text is visible and properly styled | High |
| LP-003 | Verify "Go" button visibility | Load landing page | "Go" button is visible and clickable | High |
| LP-004 | Verify "Go" button navigation | Click the "Go" button | User is redirected to /home page | High |
| LP-005 | Verify cat icon display | Load landing page | Cat face icon is visible in the header/logo area | Medium |
| LP-006 | Verify responsive layout | Resize browser to mobile width | Page elements stack properly and remain usable | Medium |

### 3.2 Home Page / Todo List Tests

#### 3.2.1 Page Load Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| HP-001 | Verify home page loads | Navigate to /home | Todo list page displays correctly | High |
| HP-002 | Verify existing todos display | Load home page with seeded data | Pre-existing todos are visible in the list | High |
| HP-003 | Verify empty state | Load page with no todos | Empty state message or placeholder is shown | Medium |

#### 3.2.2 Add Todo Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| AT-001 | Add new todo item | 1. Type text in input field 2. Submit (click add or press Enter) | New todo appears in the list | High |
| AT-002 | Add todo with long text | Enter a todo with 100+ characters | Todo is added and text displays properly (truncated or wrapped) | Medium |
| AT-003 | Prevent empty todo | Try to submit with empty input | Todo is not added; form shows validation or button is disabled | High |
| AT-004 | Add multiple todos | Add 5 different todos sequentially | All todos appear in the list in correct order | High |
| AT-005 | Input field clears after add | Add a new todo | Input field is cleared after successful submission | Medium |

#### 3.2.3 Toggle Completion Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| TC-001 | Mark todo as complete | Click checkbox/toggle on an incomplete todo | Todo shows as completed (strikethrough, checkmark, etc.) | High |
| TC-002 | Mark todo as incomplete | Click checkbox/toggle on a completed todo | Todo returns to incomplete state | High |
| TC-003 | Completion persists | 1. Mark todo complete 2. Refresh page | Todo remains in completed state | High |
| TC-004 | Visual feedback on completion | Toggle a todo | Confetti animation or visual celebration appears (if implemented) | Low |

#### 3.2.4 Delete Todo Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| DT-001 | Delete single todo | Click delete button on a todo | Todo is removed from the list | High |
| DT-002 | Delete completed todo | Delete a todo that is marked complete | Todo is removed successfully | Medium |
| DT-003 | Delete persists | 1. Delete a todo 2. Refresh page | Deleted todo does not reappear | High |
| DT-004 | Delete last todo | Delete all todos one by one | Empty state is displayed when list is empty | Medium |

### 3.3 Navigation Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| NV-001 | Navigate from landing to home | Click "Go" button on landing page | User arrives at /home with todo list | High |
| NV-002 | Direct URL access to home | Type /home directly in browser | Home page loads correctly | Medium |
| NV-003 | Handle invalid route | Navigate to non-existent URL (e.g., /xyz) | 404 Not Found page is displayed | Medium |
| NV-004 | Browser back button | 1. Go to landing 2. Click Go 3. Click browser back | Returns to landing page | Low |

### 3.4 API Tests

| Test ID | Test Case | Endpoint | Method | Expected Result | Priority |
|---------|-----------|----------|--------|-----------------|----------|
| API-001 | Get all todos | /api/todos | GET | Returns array of todos with 200 status | High |
| API-002 | Create todo | /api/todos | POST | Creates todo, returns 201 with new todo object | High |
| API-003 | Create todo - validation | /api/todos | POST | Returns 400 for empty text field | High |
| API-004 | Update todo | /api/todos/:id | PATCH | Updates todo, returns 200 with updated object | High |
| API-005 | Update non-existent todo | /api/todos/99999 | PATCH | Returns 404 Not Found | Medium |
| API-006 | Delete todo | /api/todos/:id | DELETE | Returns 204 No Content | High |
| API-007 | Delete non-existent todo | /api/todos/99999 | DELETE | Returns 204 (idempotent) or 404 | Low |

### 3.5 UI/UX Tests

| Test ID | Test Case | Steps | Expected Result | Priority |
|---------|-----------|-------|-----------------|----------|
| UX-001 | Loading state display | Slow network/load page | Loading indicator shown while fetching data | Medium |
| UX-002 | Button hover states | Hover over buttons | Visual feedback (color change, elevation) | Low |
| UX-003 | Focus states | Tab through interactive elements | Clear focus indicators visible | Medium |
| UX-004 | Dark mode (if implemented) | Toggle theme | Colors adapt appropriately | Low |
| UX-005 | Animations smooth | Add/delete/complete todos | Animations are smooth without jank | Low |

### 3.6 Responsive Design Tests

| Test ID | Test Case | Viewport | Expected Result | Priority |
|---------|-----------|----------|-----------------|----------|
| RD-001 | Desktop layout | 1920x1080 | Full layout with appropriate spacing | High |
| RD-002 | Tablet layout | 768x1024 | Layout adapts, elements remain usable | Medium |
| RD-003 | Mobile layout | 375x667 | Single column, touch-friendly buttons | High |
| RD-004 | Touch interactions | Mobile device | Tap to add, complete, delete works correctly | High |

---

## 4. Test Data

### Sample Todo Items for Testing
1. "Buy groceries"
2. "Complete project report"
3. "Call mom"
4. "Schedule dentist appointment"
5. "Read 20 pages of book"

### Edge Case Data
- Very long text: "This is an extremely long todo item that tests how the application handles text overflow and wrapping in the user interface when someone types more than expected"
- Special characters: "Test <script>alert('xss')</script>"
- Unicode: "Complete task"
- Numbers only: "12345"

---

## 5. Test Execution Checklist

### Pre-Testing Setup
- [ ] Application is running and accessible
- [ ] Database is connected and seeded
- [ ] Browser developer tools are ready

### Critical Path Tests (Must Pass)
- [ ] LP-001: Landing page loads
- [ ] LP-004: Go button navigates to home
- [ ] HP-001: Home page loads
- [ ] AT-001: Can add new todo
- [ ] TC-001: Can mark todo complete
- [ ] DT-001: Can delete todo
- [ ] API-001: GET todos returns data
- [ ] API-002: POST creates todo

### Full Regression (Before Release)
- [ ] All High priority tests passed
- [ ] All Medium priority tests passed
- [ ] Low priority tests reviewed

---

## 6. Bug Report Template

When reporting bugs, include:

```
Bug ID: [AUTO-GENERATED]
Title: Brief description
Severity: Critical / High / Medium / Low
Test Case ID: Related test case
Steps to Reproduce:
1. Step 1
2. Step 2
3. Step 3
Expected Result: What should happen
Actual Result: What actually happened
Screenshots: [Attach if applicable]
Browser/Device: Chrome 120 / Windows 11
```

---

## 7. Sign-Off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Tester | | | |
| Developer | | | |
| Product Owner | | | |

---

*Document Version: 1.0*
*Last Updated: December 26, 2025*
