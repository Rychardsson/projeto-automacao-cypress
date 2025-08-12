const { defineConfig } = require("cypress");
const { queryDb } = require("./cypress/plugins/database");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    setupNodeEvents(on, config) {
      // Plugin para executar queries no banco de dados
      on("task", {
        queryDb: ({ query, parameters }) => {
          return queryDb(query, parameters);
        },
      });
    },
    env: {
      apiUrl: "http://localhost:3000/api",
    },
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
  },
});
