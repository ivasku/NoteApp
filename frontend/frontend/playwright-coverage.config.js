// @ts-check
const { defineConfig } = require('@playwright/test');
const baseConfig = require('./playwright.config');

/**
 * Configuration for running tests with code coverage
 */
module.exports = defineConfig({
  ...baseConfig,
  use: {
    ...baseConfig.use,
    // Enable code coverage collection
    trace: 'on',
    // Collect coverage from all JS files
    collectCoverage: true,
  },
  
  // Add coverage reporter
  reporter: [
    ['html'],
    ['json', { outputFile: 'coverage/coverage.json' }],
    ['lcov', { outputDir: 'coverage' }]
  ],

  projects: [
    {
      name: 'coverage-chromium',
      use: { 
        ...baseConfig.projects[0].use,
        // Enable coverage collection in browser context
        contextOptions: {
          // Collect coverage from the page
          collectCoverage: true,
        }
      },
    },
  ],
});