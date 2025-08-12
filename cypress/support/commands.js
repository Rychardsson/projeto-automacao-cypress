// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Comando para acessar o banco de dados SQLite
Cypress.Commands.add("queryDatabase", (query, parameters = []) => {
  return cy.task("queryDb", { query, parameters });
});

// Comando para resetar o banco de dados
Cypress.Commands.add("resetDatabase", () => {
  return cy.request("POST", `${Cypress.env("apiUrl")}/reset-database`);
});

// Comando para popular dados de teste
Cypress.Commands.add("seedDatabase", () => {
  return cy.request("POST", `${Cypress.env("apiUrl")}/seed-database`);
});

// Comando para criar fornecedor via API
Cypress.Commands.add("criarFornecedor", (fornecedor) => {
  return cy.request({
    method: "POST",
    url: `${Cypress.env("apiUrl")}/fornecedores`,
    body: fornecedor,
  });
});

// Comando para buscar fornecedor por ID via API
Cypress.Commands.add("buscarFornecedor", (id) => {
  return cy.request({
    method: "GET",
    url: `${Cypress.env("apiUrl")}/fornecedores/${id}`,
  });
});

// Comando para atualizar fornecedor via API
Cypress.Commands.add("atualizarFornecedor", (id, dados) => {
  return cy.request({
    method: "PUT",
    url: `${Cypress.env("apiUrl")}/fornecedores/${id}`,
    body: dados,
  });
});

// Comando para excluir fornecedor via API
Cypress.Commands.add("excluirFornecedor", (id) => {
  return cy.request({
    method: "DELETE",
    url: `${Cypress.env("apiUrl")}/fornecedores/${id}`,
  });
});
