const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://www.saucedemo.com',
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: false,
    testIsolation: true,
    setupNodeEvents(on, config) {
      return config;
    },
  },
  // Cypress 16 eliminó Cypress.env(): los valores públicos se exponen con 'expose'.
  expose: {
    petstoreApiUrl: 'https://petstore.swagger.io/v2',
    sauceUser: 'standard_user',
    saucePassword: 'secret_sauce',
  },
  retries: { runMode: 0, openMode: 0 },
  defaultCommandTimeout: 10000,
  requestTimeout: 12000,
  responseTimeout: 30000,
  video: true,
  screenshotOnRunFailure: true,
  screenshotsFolder: 'cypress/screenshots',
  videosFolder: 'cypress/videos',
  reporter: 'mocha-junit-reporter',
  reporterOptions: {
    mochaFile: 'reports/junit/resultado-[hash].xml',
    toConsole: true,
  },
});
