const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/e2e.js",
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    env: {
      apiUrl: "http://localhost:3000/api",
    },
    setupNodeEvents(on, config) {
      // Plugin para consultas diretas no banco SQLite
      on("task", {
        // Reset do banco de dados
        resetDb() {
          const Database = require("./server/database");
          return new Promise(async (resolve) => {
            const db = new Database();
            try {
              await db.run("DELETE FROM fornecedores");
              await db.close();
              resolve(null);
            } catch (error) {
              console.error("Erro ao resetar DB:", error);
              await db.close();
              resolve(null);
            }
          });
        },

        // Query customizada no banco
        queryDb({ query, parameters = [] }) {
          const Database = require("./server/database");
          return new Promise(async (resolve) => {
            const db = new Database();
            try {
              const result = await db.all(query, parameters);
              await db.close();
              resolve(result);
            } catch (error) {
              console.error("Erro na query:", error);
              await db.close();
              resolve([]);
            }
          });
        },

        // Popular dados de teste
        seedDb() {
          const Database = require("./server/database");
          return new Promise(async (resolve) => {
            const db = new Database();
            try {
              await db.run("DELETE FROM fornecedores");

              const fornecedores = [
                {
                  nome: "Cypress Test Corp",
                  email: "test@cypress.com",
                  telefone: "(11) 1111-1111",
                  endereco: "Rua dos Testes, 123",
                  cnpj: "11.111.111/0001-11",
                },
                {
                  nome: "Automation Ltd",
                  email: "automation@test.com",
                  telefone: "(22) 2222-2222",
                  endereco: "Av. da Automação, 456",
                  cnpj: "22.222.222/0002-22",
                },
              ];

              for (const fornecedor of fornecedores) {
                await db.run(
                  "INSERT INTO fornecedores (nome, email, telefone, endereco, cnpj) VALUES (?, ?, ?, ?, ?)",
                  [
                    fornecedor.nome,
                    fornecedor.email,
                    fornecedor.telefone,
                    fornecedor.endereco,
                    fornecedor.cnpj,
                  ]
                );
              }

              await db.close();
              resolve(null);
            } catch (error) {
              console.error("Erro ao popular DB:", error);
              await db.close();
              resolve(null);
            }
          });
        },
      });

      return config;
    },
  },
});
