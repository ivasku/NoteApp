const { test, expect } = require('@playwright/test');
const { registerUser, generateUniqueUser, createNote } = require('../helpers/auth-helper');

test.describe('Visual Tests', () => {
  test('should match login page screenshot', async ({ page }) => {
    await page.goto('/login');
    
    await expect(page.locator('h2:has-text("Sign in to your account")')).toBeVisible();
    
    await expect(page).toHaveScreenshot('login-page.png');
  });

  test('should match register page screenshot', async ({ page }) => {
    await page.goto('/register');
    
    await expect(page.locator('h2:has-text("Create your account")')).toBeVisible();
    
    await expect(page).toHaveScreenshot('register-page.png');
  });

  test('should match empty dashboard screenshot', async ({ page }) => {
    const user = generateUniqueUser();
    await registerUser(page, user.username, user.email, user.password);
    
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('h1:has-text("My Notes")')).toBeVisible();
    
    await expect(page).toHaveScreenshot('empty-dashboard.png');
  });

  test('should match dashboard with notes screenshot', async ({ page }) => {
    const user = generateUniqueUser();
    await registerUser(page, user.username, user.email, user.password);
    
    await createNote(page, 'Meeting Notes', 'Discussed project timeline and deliverables for Q1.');
    await createNote(page, 'Shopping List', 'Milk, Bread, Eggs, Coffee, Bananas');
    await createNote(page, 'Ideas', 'New app features: dark mode, export notes, tags');
    
    await expect(page.locator('h2:has-text("My Notes (3)")')).toBeVisible();
    
    await expect(page).toHaveScreenshot('dashboard-with-notes.png');
  });

  test('should match note creation form screenshot', async ({ page }) => {
    const user = generateUniqueUser();
    await registerUser(page, user.username, user.email, user.password);
    
    await page.click('button:has-text("+ New Note")');
    
    await expect(page.locator('h3:has-text("Create New Note")')).toBeVisible();
    
    await expect(page).toHaveScreenshot('note-creation-form.png');
  });

  test('should match note edit form screenshot', async ({ page }) => {
    const user = generateUniqueUser();
    await registerUser(page, user.username, user.email, user.password);
    
    await createNote(page, 'Sample Note', 'This is a sample note for editing.');
    
    await page.click('button:has-text("Edit")');
    
    await expect(page.locator('h3:has-text("Edit Note")')).toBeVisible();
    
    await expect(page).toHaveScreenshot('note-edit-form.png');
  });

  test('should match mobile view screenshots', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/login');
    await expect(page.locator('h2:has-text("Sign in to your account")')).toBeVisible();
    
    await expect(page).toHaveScreenshot('mobile-login-page.png');
    
    const user = generateUniqueUser();
    await registerUser(page, user.username, user.email, user.password);
    
    await createNote(page, 'Mobile Note', 'Testing mobile view');
    await expect(page).toHaveScreenshot('mobile-dashboard.png');
  });
});