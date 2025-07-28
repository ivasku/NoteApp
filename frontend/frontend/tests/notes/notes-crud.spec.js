const { test, expect } = require('@playwright/test');

test.describe('Notes CRUD Operations', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    
    const timestamp = Date.now();
    const email = `test${timestamp}@example.com`;
    const username = `testuser${timestamp}`;
    
    await page.goto('/register');
    await page.fill('input[name="username"]', username);
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="confirmPassword"]', 'password123');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/dashboard');
  });

  test('should display empty notes list initially', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('My Notes');
    await expect(page.locator('h2')).toContainText('My Notes (0)');
    await expect(page.locator('text=No notes yet. Create your first note!')).toBeVisible();
    await expect(page.locator('button:has-text("+ New Note")')).toBeVisible();
  });

  test('should create a new note successfully', async ({ page }) => {
    await page.click('button:has-text("+ New Note")');
    
    await expect(page.locator('h3:has-text("Create New Note")')).toBeVisible();
    
    await page.fill('input[value=""]', 'My First Note'); // Title input
    await page.fill('textarea', 'This is the content of my first note.');
    
    await page.click('button:has-text("Save Note")');
    
    await expect(page.locator('h2')).toContainText('My Notes (1)');
    await expect(page.locator('h4:has-text("My First Note")')).toBeVisible();
    await expect(page.locator('text=This is the content of my first note.')).toBeVisible();
    
    await expect(page.locator('h3:has-text("Create New Note")')).not.toBeVisible();
  });

  test('should cancel note creation', async ({ page }) => {
    await page.click('button:has-text("+ New Note")');
    
    await page.fill('input[value=""]', 'Draft Note');
    await page.fill('textarea', 'This note will be cancelled.');
    
    await page.click('button:has-text("Cancel")');
    
    await expect(page.locator('h3:has-text("Create New Note")')).not.toBeVisible();
    await expect(page.locator('h2')).toContainText('My Notes (0)');
    await expect(page.locator('text=No notes yet. Create your first note!')).toBeVisible();
  });

  test('should edit an existing note', async ({ page }) => {
    await page.click('button:has-text("+ New Note")');
    await page.fill('input[value=""]', 'Original Title');
    await page.fill('textarea', 'Original content.');
    await page.click('button:has-text("Save Note")');
    
    await expect(page.locator('h4:has-text("Original Title")')).toBeVisible();
    
    await page.click('button:has-text("Edit")');
    
    await expect(page.locator('h3:has-text("Edit Note")')).toBeVisible();
    await expect(page.locator('input[value="Original Title"]')).toBeVisible();

    await page.fill('input[value="Original Title"]', 'Updated Title');
    await page.fill('textarea', 'Updated content with new information.');

    await page.click('button:has-text("Update Note")');
    
    await expect(page.locator('h4:has-text("Updated Title")')).toBeVisible();
    await expect(page.locator('text=Updated content with new information.')).toBeVisible();
    await expect(page.locator('h4:has-text("Original Title")')).not.toBeVisible();
    
    await expect(page.locator('h3:has-text("Edit Note")')).not.toBeVisible();
  });

  test('should delete a note', async ({ page }) => {
    await page.click('button:has-text("+ New Note")');
    await page.fill('input[value=""]', 'Note to Delete');
    await page.fill('textarea', 'This note will be deleted.');
    await page.click('button:has-text("Save Note")');
    
    await expect(page.locator('h4:has-text("Note to Delete")')).toBeVisible();
    await expect(page.locator('h2')).toContainText('My Notes (1)');
    
    page.on('dialog', dialog => dialog.accept());
    
    await page.click('button:has-text("Delete")');
    
    await expect(page.locator('h2')).toContainText('My Notes (0)');
    await expect(page.locator('h4:has-text("Note to Delete")')).not.toBeVisible();
    await expect(page.locator('text=No notes yet. Create your first note!')).toBeVisible();
  });

  test('should handle multiple notes', async ({ page }) => {
    const notes = [
      { title: 'First Note', content: 'Content of first note' },
      { title: 'Second Note', content: 'Content of second note' },
      { title: 'Third Note', content: 'Content of third note' }
    ];
    
    for (const note of notes) {
      await page.click('button:has-text("+ New Note")');
      await page.fill('input[value=""]', note.title);
      await page.fill('textarea', note.content);
      await page.click('button:has-text("Save Note")');
    }
    
    await expect(page.locator('h2')).toContainText('My Notes (3)');
    
    for (const note of notes) {
      await expect(page.locator(`h4:has-text("${note.title}")`)).toBeVisible();
      await expect(page.locator(`text=${note.content}`)).toBeVisible();
    }
    
    page.on('dialog', dialog => dialog.accept());
    
    const secondNoteCard = page.locator('.card:has(h4:has-text("Second Note"))');
    await secondNoteCard.locator('button:has-text("Delete")').click();
    
    await expect(page.locator('h2')).toContainText('My Notes (2)');
    await expect(page.locator('h4:has-text("Second Note")')).not.toBeVisible();
    await expect(page.locator('h4:has-text("First Note")')).toBeVisible();
    await expect(page.locator('h4:has-text("Third Note")')).toBeVisible();
  });

  test('should show validation errors for empty note fields', async ({ page }) => {
    await page.click('button:has-text("+ New Note")');
    
    await page.click('button:has-text("Save Note")');
    
    await expect(page.locator('h3:has-text("Create New Note")')).toBeVisible();
  });

  test('should display note creation date', async ({ page }) => {
    await page.click('button:has-text("+ New Note")');
    await page.fill('input[value=""]', 'Date Test Note');
    await page.fill('textarea', 'Testing date display.');
    await page.click('button:has-text("Save Note")');
    
    const today = new Date().toLocaleDateString();
    const noteCard = page.locator('.card:has(h4:has-text("Date Test Note"))');
    
    await expect(noteCard.locator('small')).toBeVisible();
  });
});