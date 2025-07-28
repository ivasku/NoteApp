const { test, expect } = require('@playwright/test');

test.describe('Registration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/register');
  });

  test('should display registration form', async ({ page }) => {
    await expect(page.locator('h2')).toContainText('Create your account');
    await expect(page.locator('input[name="username"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('input[name="confirmPassword"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should show validation errors for empty fields', async ({ page }) => {
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Username is required')).toBeVisible();
    await expect(page.locator('text=Email is required')).toBeVisible();
    await expect(page.locator('text=Password is required')).toBeVisible();
    await expect(page.locator('text=Please confirm your password')).toBeVisible();
  });

  test('should show validation error for short username', async ({ page }) => {
    await page.fill('input[name="username"]', 'ab');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="confirmPassword"]', 'password123');
    
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Username must be at least 3 characters')).toBeVisible();
  });

  test('should show validation error for short password', async ({ page }) => {
    await page.fill('input[name="username"]', 'testuser');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', '12345');
    await page.fill('input[name="confirmPassword"]', '12345');
    
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Password must be at least 6 characters')).toBeVisible();
  });

  test('should show validation error for password mismatch', async ({ page }) => {
    await page.fill('input[name="username"]', 'testuser');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="confirmPassword"]', 'differentpassword');
    
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Passwords do not match')).toBeVisible();
  });

  test('should show validation error for invalid email', async ({ page }) => {
    await page.fill('input[name="username"]', 'testuser');
    await page.fill('input[name="email"]', 'invalid-email');
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="confirmPassword"]', 'password123');
    
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Email is invalid')).toBeVisible();
  });

  test('should successfully register with valid data', async ({ page }) => {
    const timestamp = Date.now();
    const username = `testuser${timestamp}`;
    const email = `test${timestamp}@example.com`;
    
    await page.fill('input[name="username"]', username);
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="confirmPassword"]', 'password123');
    
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('h1')).toContainText('My Notes');
    
    await expect(page.locator(`button:has-text("${username.charAt(0).toUpperCase()}")`)).toBeVisible();
  });

  test('should navigate to login page', async ({ page }) => {
    await page.click('a:has-text("sign in to your existing account")');

    await expect(page).toHaveURL('/login');
    await expect(page.locator('h2')).toContainText('Sign in to your account');
  });
});