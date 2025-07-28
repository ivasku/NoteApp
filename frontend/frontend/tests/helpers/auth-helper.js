/**
 * Helper functions for authentication in tests
 */

/**
 * Register a new user with unique credentials
 * @param {import('@playwright/test').Page} page 
 * @param {string} username 
 * @param {string} email 
 * @param {string} password 
 */
async function registerUser(page, username, email, password = 'password123') {
  await page.goto('/register');
  await page.fill('input[name="username"]', username);
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.fill('input[name="confirmPassword"]', password);
  await page.click('button[type="submit"]');
}

/**
 * Login with existing credentials
 * @param {import('@playwright/test').Page} page 
 * @param {string} email 
 * @param {string} password 
 */
async function loginUser(page, email, password = 'password123') {
  await page.goto('/login');
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');
}

/**
 * Logout current user
 * @param {import('@playwright/test').Page} page 
 */
async function logoutUser(page) {
  await page.click('button[style*="background: #007bff"]');
  await page.click('button:has-text("Sign out")');
}

/**
 * Generate unique user credentials for testing
 * @returns {Object} Object with username, email, and password
 */
function generateUniqueUser() {
  const timestamp = Date.now();
  return {
    username: `testuser${timestamp}`,
    email: `test${timestamp}@example.com`,
    password: 'password123'
  };
}

/**
 * Create a test note
 * @param {import('@playwright/test').Page} page 
 * @param {string} title 
 * @param {string} content 
 */
async function createNote(page, title, content) {
  await page.click('button:has-text("+ New Note")');
  await page.fill('input[value=""]', title);
  await page.fill('textarea', content);
  await page.click('button:has-text("Save Note")');
}

/**
 * Delete a note by title
 * @param {import('@playwright/test').Page} page 
 * @param {string} title 
 */
async function deleteNote(page, title) {
  page.on('dialog', dialog => dialog.accept());
  
  const noteCard = page.locator(`.card:has(h4:has-text("${title}"))`);
  await noteCard.locator('button:has-text("Delete")').click();
}

/**
 * Edit a note by title
 * @param {import('@playwright/test').Page} page 
 * @param {string} currentTitle 
 * @param {string} newTitle 
 * @param {string} newContent 
 */
async function editNote(page, currentTitle, newTitle, newContent) {
  const noteCard = page.locator(`.card:has(h4:has-text("${currentTitle}"))`);
  await noteCard.locator('button:has-text("Edit")').click();
  
  await page.fill(`input[value="${currentTitle}"]`, newTitle);
  await page.fill('textarea', newContent);
  await page.click('button:has-text("Update Note")');
}

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  generateUniqueUser,
  createNote,
  deleteNote,
  editNote
};