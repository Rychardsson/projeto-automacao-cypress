describe("API de Fornecedores - CRUD + Integração com Banco", () => {
  beforeEach(() => {
    // Limpar banco antes de cada teste e popular com dados de fixture
    cy.resetDatabase();
    cy.seedDatabase();
  });

  describe("Operações CRUD via API", () => {
    it("Deve criar um novo fornecedor", () => {
      cy.fixture("fornecedores").then((data) => {
        cy.criarFornecedor(data.fornecedorValido).then((response) => {
          expect(response.status).to.eq(201);
          expect(response.body).to.have.property("id");
          expect(response.body.nome).to.eq(data.fornecedorValido.nome);
          expect(response.body.email).to.eq(data.fornecedorValido.email);
          expect(response.body.cnpj).to.eq(data.fornecedorValido.cnpj);
        });
      });
    });

    it("Deve buscar fornecedor por ID", () => {
      cy.fixture("fornecedores").then((data) => {
        // Criar fornecedor primeiro
        cy.criarFornecedor(data.fornecedorValido).then((createResponse) => {
          const id = createResponse.body.id;

          // Buscar por ID
          cy.buscarFornecedor(id).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.id).to.eq(id);
            expect(response.body.nome).to.eq(data.fornecedorValido.nome);
            expect(response.body.email).to.eq(data.fornecedorValido.email);
          });
        });
      });
    });

    it("Deve listar todos os fornecedores", () => {
      cy.fixture("fornecedores").then((data) => {
        // Criar múltiplos fornecedores
        data.fornecedoresLote.forEach((fornecedor) => {
          cy.criarFornecedor(fornecedor);
        });

        // Listar todos (incluindo os 2 do seed + 3 criados = 5 total)
        cy.listarFornecedores().then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.be.an("array");
          expect(response.body.length).to.eq(5);
        });
      });
    });

    it("Deve atualizar um fornecedor", () => {
      cy.fixture("fornecedores").then((data) => {
        // Criar fornecedor
        cy.criarFornecedor(data.fornecedorParaEdicao).then((createResponse) => {
          const id = createResponse.body.id;

          // Atualizar fornecedor
          cy.atualizarFornecedor(id, data.fornecedorEditado).then(
            (response) => {
              expect(response.status).to.eq(200);
              expect(response.body.nome).to.eq(data.fornecedorEditado.nome);
              expect(response.body.email).to.eq(data.fornecedorEditado.email);
              expect(response.body.ativo).to.eq(0); // false = 0 no SQLite
            }
          );
        });
      });
    });

    it("Deve excluir um fornecedor", () => {
      cy.fixture("fornecedores").then((data) => {
        // Criar fornecedor
        cy.criarFornecedor(data.fornecedorValido).then((createResponse) => {
          const id = createResponse.body.id;

          // Excluir fornecedor
          cy.excluirFornecedor(id).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.message).to.include("removido com sucesso");
          });

          // Verificar se foi realmente excluído
          cy.buscarFornecedor(id).then((response) => {
            expect(response.status).to.eq(404);
          });
        });
      });
    });
  });

  describe("Validações de API", () => {
    it("Deve retornar erro 404 para fornecedor inexistente", () => {
      cy.buscarFornecedor(999999).then((response) => {
        expect(response.status).to.eq(404);
        expect(response.body.error).to.include("não encontrado");
      });
    });

    it("Deve retornar erro ao criar fornecedor com dados inválidos", () => {
      cy.fixture("fornecedores").then((data) => {
        cy.criarFornecedor(data.fornecedorInvalido).then((response) => {
          expect(response.status).to.eq(400);
          expect(response.body.error).to.include("obrigatórios");
        });
      });
    });

    it("Deve retornar erro ao criar fornecedor com email duplicado", () => {
      cy.fixture("fornecedores").then((data) => {
        // Criar primeiro fornecedor
        cy.criarFornecedor(data.fornecedorValido).then(() => {
          // Tentar criar outro com mesmo email
          cy.criarFornecedor(data.fornecedorValido).then((response) => {
            expect(response.status).to.eq(400);
            expect(response.body.error).to.include("já está em uso");
          });
        });
      });
    });
  });

  describe("Integração com Banco de Dados SQLite", () => {
    it("Deve validar criação no banco via query direta", () => {
      cy.fixture("fornecedores").then((data) => {
        cy.criarFornecedor(data.fornecedorValido).then((response) => {
          const fornecedorId = response.body.id;

          // Consultar diretamente no banco
          cy.queryDatabase("SELECT * FROM fornecedores WHERE id = ?", [
            fornecedorId,
          ]).then((result) => {
            expect(result).to.have.length(1);
            expect(result[0].nome).to.eq(data.fornecedorValido.nome);
            expect(result[0].email).to.eq(data.fornecedorValido.email);
            expect(result[0].cnpj).to.eq(data.fornecedorValido.cnpj);
            expect(result[0].ativo).to.eq(1); // true = 1 no SQLite
          });
        });
      });
    });

    it("Deve validar atualização no banco via query direta", () => {
      cy.fixture("fornecedores").then((data) => {
        cy.criarFornecedor(data.fornecedorParaEdicao).then((createResponse) => {
          const id = createResponse.body.id;

          cy.atualizarFornecedor(id, data.fornecedorEditado).then(() => {
            // Verificar no banco se foi atualizado
            cy.queryDatabase("SELECT * FROM fornecedores WHERE id = ?", [
              id,
            ]).then((result) => {
              expect(result[0].nome).to.eq(data.fornecedorEditado.nome);
              expect(result[0].email).to.eq(data.fornecedorEditado.email);
              expect(result[0].ativo).to.eq(0); // false = 0 no SQLite
              expect(result[0].updated_at).to.not.equal(result[0].created_at);
            });
          });
        });
      });
    });

    it("Deve validar exclusão no banco via query direta", () => {
      cy.fixture("fornecedores").then((data) => {
        cy.criarFornecedor(data.fornecedorValido).then((createResponse) => {
          const id = createResponse.body.id;

          cy.excluirFornecedor(id).then(() => {
            // Verificar no banco se foi removido
            cy.queryDatabase("SELECT * FROM fornecedores WHERE id = ?", [
              id,
            ]).then((result) => {
              expect(result).to.have.length(0);
            });
          });
        });
      });
    });

    it("Deve validar contagem total no banco", () => {
      cy.fixture("fornecedores").then((data) => {
        // Criar 3 fornecedores
        data.fornecedoresLote.forEach((fornecedor) => {
          cy.criarFornecedor(fornecedor);
        });

        // Verificar contagem no banco (2 do seed + 3 criados = 5)
        cy.queryDatabase("SELECT COUNT(*) as total FROM fornecedores").then(
          (result) => {
            expect(result[0].total).to.eq(5);
          }
        );
      });
    });

    it("Deve validar reset do banco", () => {
      // Verificar que existem dados (do seed)
      cy.queryDatabase("SELECT COUNT(*) as total FROM fornecedores").then(
        (result) => {
          expect(result[0].total).to.be.greaterThan(0);
        }
      );

      // Fazer reset
      cy.resetDatabase();

      // Verificar que não existem mais dados
      cy.queryDatabase("SELECT COUNT(*) as total FROM fornecedores").then(
        (result) => {
          expect(result[0].total).to.eq(0);
        }
      );
    });
  });
});
