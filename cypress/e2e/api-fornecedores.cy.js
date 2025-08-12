describe('API de Fornecedores', () => {
  let fornecedorId;

  beforeEach(() => {
    // Resetar o banco antes de cada teste
    cy.resetDatabase();
  });

  describe('Operações CRUD via API', () => {
    it('Deve criar um novo fornecedor', () => {
      cy.fixture('fornecedores').then((data) => {
        cy.criarFornecedor(data.fornecedorValido).then((response) => {
          expect(response.status).to.eq(201);
          expect(response.body).to.have.property('id');
          expect(response.body.nome).to.eq(data.fornecedorValido.nome);
          expect(response.body.email).to.eq(data.fornecedorValido.email);
          
          fornecedorId = response.body.id;
        });
      });
    });

    it('Deve buscar fornecedor por ID', () => {
      cy.fixture('fornecedores').then((data) => {
        // Primeiro criar um fornecedor
        cy.criarFornecedor(data.fornecedorValido).then((createResponse) => {
          const id = createResponse.body.id;
          
          // Depois buscar por ID
          cy.buscarFornecedor(id).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.id).to.eq(id);
            expect(response.body.nome).to.eq(data.fornecedorValido.nome);
          });
        });
      });
    });

    it('Deve listar todos os fornecedores', () => {
      cy.fixture('fornecedores').then((data) => {
        // Criar múltiplos fornecedores
        data.fornecedoresBatch.forEach((fornecedor) => {
          cy.criarFornecedor(fornecedor);
        });

        // Listar todos
        cy.request('GET', `${Cypress.env('apiUrl')}/fornecedores`).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.be.an('array');
          expect(response.body.length).to.eq(3);
        });
      });
    });

    it('Deve atualizar um fornecedor', () => {
      cy.fixture('fornecedores').then((data) => {
        // Criar fornecedor
        cy.criarFornecedor(data.fornecedorParaEdicao).then((createResponse) => {
          const id = createResponse.body.id;
          
          // Atualizar fornecedor
          cy.atualizarFornecedor(id, data.fornecedorEditado).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.nome).to.eq(data.fornecedorEditado.nome);
            expect(response.body.email).to.eq(data.fornecedorEditado.email);
            expect(response.body.ativo).to.eq(data.fornecedorEditado.ativo);
          });
        });
      });
    });

    it('Deve excluir um fornecedor', () => {
      cy.fixture('fornecedores').then((data) => {
        // Criar fornecedor
        cy.criarFornecedor(data.fornecedorValido).then((createResponse) => {
          const id = createResponse.body.id;
          
          // Excluir fornecedor
          cy.excluirFornecedor(id).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.message).to.include('removido com sucesso');
          });

          // Verificar se foi realmente excluído
          cy.request({
            method: 'GET',
            url: `${Cypress.env('apiUrl')}/fornecedores/${id}`,
            failOnStatusCode: false
          }).then((response) => {
            expect(response.status).to.eq(404);
          });
        });
      });
    });
  });

  describe('Validações de API', () => {
    it('Deve retornar erro 404 para fornecedor inexistente', () => {
      cy.request({
        method: 'GET',
        url: `${Cypress.env('apiUrl')}/fornecedores/999999`,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(404);
        expect(response.body.error).to.include('não encontrado');
      });
    });

    it('Deve retornar erro ao criar fornecedor com dados inválidos', () => {
      cy.fixture('fornecedores').then((data) => {
        cy.request({
          method: 'POST',
          url: `${Cypress.env('apiUrl')}/fornecedores`,
          body: data.fornecedorInvalido,
          failOnStatusCode: false
        }).then((response) => {
          expect(response.status).to.be.oneOf([400, 422]);
        });
      });
    });
  });

  describe('Integração com Banco de Dados', () => {
    it('Deve validar se os dados foram inseridos corretamente no banco', () => {
      cy.fixture('fornecedores').then((data) => {
        cy.criarFornecedor(data.fornecedorValido).then((response) => {
          const fornecedorId = response.body.id;
          
          // Consultar diretamente no banco de dados
          const query = 'SELECT * FROM fornecedores WHERE id = ?';
          cy.task('queryDb', { query, parameters: [fornecedorId] }).then((result) => {
            expect(result).to.have.length(1);
            expect(result[0].nome).to.eq(data.fornecedorValido.nome);
            expect(result[0].email).to.eq(data.fornecedorValido.email);
            expect(result[0].ativo).to.eq(1); // SQLite usa 1 para true
          });
        });
      });
    });

    it('Deve validar se a atualização foi persistida no banco', () => {
      cy.fixture('fornecedores').then((data) => {
        cy.criarFornecedor(data.fornecedorParaEdicao).then((createResponse) => {
          const id = createResponse.body.id;
          
          cy.atualizarFornecedor(id, data.fornecedorEditado).then(() => {
            // Verificar no banco se foi atualizado
            const query = 'SELECT * FROM fornecedores WHERE id = ?';
            cy.task('queryDb', { query, parameters: [id] }).then((result) => {
              expect(result[0].nome).to.eq(data.fornecedorEditado.nome);
              expect(result[0].ativo).to.eq(0); // false no SQLite é 0
            });
          });
        });
      });
    });

    it('Deve validar se o registro foi removido do banco', () => {
      cy.fixture('fornecedores').then((data) => {
        cy.criarFornecedor(data.fornecedorValido).then((createResponse) => {
          const id = createResponse.body.id;
          
          cy.excluirFornecedor(id).then(() => {
            // Verificar no banco se foi removido
            const query = 'SELECT * FROM fornecedores WHERE id = ?';
            cy.task('queryDb', { query, parameters: [id] }).then((result) => {
              expect(result).to.have.length(0);
            });
          });
        });
      });
    });
  });
});
