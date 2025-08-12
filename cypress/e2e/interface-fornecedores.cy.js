describe('Interface de Fornecedores', () => {
  beforeEach(() => {
    // Resetar dados e popular base de teste
    cy.resetDatabase();
    cy.seedDatabase();
    cy.visit('/');
  });

  describe('Funcionalidades da Interface', () => {
    it('Deve exibir a página inicial corretamente', () => {
      cy.contains('Sistema de Fornecedores').should('be.visible');
      cy.get('[data-cy="btn-editar"]').should('exist');
      cy.get('table').should('be.visible');
    });

    it('Deve listar fornecedores na tabela', () => {
      cy.get('#tabelaFornecedores tbody tr').should('have.length.at.least', 1);
      cy.get('[data-cy="fornecedor-nome"]').should('be.visible');
      cy.get('[data-cy="fornecedor-email"]').should('be.visible');
    });

    it('Deve abrir modal para novo fornecedor', () => {
      cy.contains('Novo Fornecedor').click();
      cy.get('#modalFornecedor').should('be.visible');
      cy.get('#modalFornecedorLabel').should('contain', 'Novo Fornecedor');
      cy.get('#nome').should('be.empty');
      cy.get('#email').should('be.empty');
    });

    it('Deve criar um novo fornecedor via interface', () => {
      cy.fixture('fornecedores').then((data) => {
        const fornecedor = data.fornecedorValido;
        
        // Abrir modal
        cy.contains('Novo Fornecedor').click();
        
        // Preencher formulário
        cy.get('#nome').type(fornecedor.nome);
        cy.get('#email').type(fornecedor.email);
        cy.get('#telefone').type(fornecedor.telefone);
        cy.get('#cnpj').type(fornecedor.cnpj);
        cy.get('#endereco').type(fornecedor.endereco);
        
        // Salvar
        cy.contains('Salvar').click();
        
        // Verificar se apareceu na tabela
        cy.get('#modalFornecedor').should('not.be.visible');
        cy.contains(fornecedor.nome).should('be.visible');
        cy.contains(fornecedor.email).should('be.visible');
        
        // Verificar mensagem de sucesso
        cy.contains('criado com sucesso').should('be.visible');
      });
    });

    it('Deve editar um fornecedor existente', () => {
      cy.fixture('fornecedores').then((data) => {
        const dadosEditados = data.fornecedorEditado;
        
        // Clicar no primeiro botão de editar
        cy.get('[data-cy="btn-editar"]').first().click();
        
        // Verificar se modal abriu com dados preenchidos
        cy.get('#modalFornecedor').should('be.visible');
        cy.get('#modalFornecedorLabel').should('contain', 'Editar Fornecedor');
        cy.get('#nome').should('not.be.empty');
        
        // Editar dados
        cy.get('#nome').clear().type(dadosEditados.nome);
        cy.get('#email').clear().type(dadosEditados.email);
        cy.get('#telefone').clear().type(dadosEditados.telefone);
        
        // Salvar alterações
        cy.contains('Salvar').click();
        
        // Verificar se dados foram atualizados
        cy.get('#modalFornecedor').should('not.be.visible');
        cy.contains(dadosEditados.nome).should('be.visible');
        cy.contains(dadosEditados.email).should('be.visible');
        cy.contains('atualizado com sucesso').should('be.visible');
      });
    });

    it('Deve excluir um fornecedor', () => {
      // Obter o nome do primeiro fornecedor para verificar remoção
      cy.get('[data-cy="fornecedor-nome"]').first().then(($nome) => {
        const nomeFornecedor = $nome.text();
        
        // Clicar no botão excluir
        cy.get('[data-cy="btn-excluir"]').first().click();
        
        // Confirmar exclusão no alert
        cy.on('window:confirm', () => true);
        
        // Verificar se foi removido da tabela
        cy.contains(nomeFornecedor).should('not.exist');
        cy.contains('excluído com sucesso').should('be.visible');
      });
    });

    it('Deve atualizar a lista de fornecedores', () => {
      // Contar fornecedores iniciais
      cy.get('#tabelaFornecedores tbody tr').then(($rows) => {
        const initialCount = $rows.length;
        
        // Adicionar novo fornecedor via API
        cy.fixture('fornecedores').then((data) => {
          cy.criarFornecedor(data.fornecedorValido);
        });
        
        // Clicar em atualizar
        cy.contains('Atualizar Lista').click();
        
        // Verificar se a contagem aumentou
        cy.get('#tabelaFornecedores tbody tr').should('have.length', initialCount + 1);
      });
    });

    it('Deve popular dados de teste', () => {
      // Resetar primeiro
      cy.resetDatabase();
      cy.visit('/');
      
      // Verificar que não há fornecedores
      cy.get('#tabelaFornecedores tbody tr').should('have.length', 0);
      
      // Popular dados
      cy.contains('Popular Dados de Teste').click();
      
      // Verificar se dados foram inseridos
      cy.get('#tabelaFornecedores tbody tr').should('have.length.at.least', 1);
      cy.contains('Dados de teste inseridos com sucesso').should('be.visible');
    });
  });

  describe('Validações da Interface', () => {
    it('Deve validar campos obrigatórios', () => {
      cy.contains('Novo Fornecedor').click();
      
      // Tentar salvar sem preencher campos obrigatórios
      cy.contains('Salvar').click();
      
      // Verificar se formulário não foi submetido (modal ainda visível)
      cy.get('#modalFornecedor').should('be.visible');
      
      // Verificar validação HTML5
      cy.get('#nome:invalid').should('exist');
      cy.get('#email:invalid').should('exist');
    });

    it('Deve validar formato de email', () => {
      cy.contains('Novo Fornecedor').click();
      
      cy.get('#nome').type('Teste');
      cy.get('#email').type('email-invalido');
      
      cy.contains('Salvar').click();
      
      // Verificar validação de email
      cy.get('#email:invalid').should('exist');
      cy.get('#modalFornecedor').should('be.visible');
    });
  });

  describe('Integração Interface + API + Banco', () => {
    it('Deve validar fluxo completo: criar via interface e verificar no banco', () => {
      cy.fixture('fornecedores').then((data) => {
        const fornecedor = data.fornecedorValido;
        
        // Criar via interface
        cy.contains('Novo Fornecedor').click();
        cy.get('#nome').type(fornecedor.nome);
        cy.get('#email').type(fornecedor.email);
        cy.get('#telefone').type(fornecedor.telefone);
        cy.contains('Salvar').click();
        
        // Aguardar criação
        cy.contains('criado com sucesso').should('be.visible');
        
        // Verificar no banco de dados
        cy.task('queryDb', { 
          query: 'SELECT * FROM fornecedores WHERE email = ?', 
          parameters: [fornecedor.email] 
        }).then((result) => {
          expect(result).to.have.length(1);
          expect(result[0].nome).to.eq(fornecedor.nome);
          expect(result[0].email).to.eq(fornecedor.email);
        });
      });
    });

    it('Deve validar exclusão via interface e confirmar no banco', () => {
      // Pegar dados do primeiro fornecedor
      cy.get('[data-cy="fornecedor-email"]').first().then(($email) => {
        const emailFornecedor = $email.text();
        
        // Excluir via interface
        cy.get('[data-cy="btn-excluir"]').first().click();
        cy.on('window:confirm', () => true);
        
        // Aguardar exclusão
        cy.contains('excluído com sucesso').should('be.visible');
        
        // Verificar no banco que foi removido
        cy.task('queryDb', { 
          query: 'SELECT * FROM fornecedores WHERE email = ?', 
          parameters: [emailFornecedor] 
        }).then((result) => {
          expect(result).to.have.length(0);
        });
      });
    });
  });
});
