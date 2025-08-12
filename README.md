# Projeto de Automação com Cypress + SQLite

Este projeto demonstra a integração entre automação de testes com Cypress e consultas diretas ao banco de dados SQLite, incluindo um CRUD completo de fornecedores.

## 🚀 Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web para API REST
- **SQLite** - Banco de dados relacional leve
- **Cypress** - Framework de testes E2E
- **Bootstrap** - Framework CSS para interface
- **HTML/CSS/JavaScript** - Frontend

## 📁 Estrutura do Projeto

```
projeto-automacao-cypress/
├── cypress/
│   ├── e2e/
│   │   ├── api-fornecedores.cy.js      # Testes de API
│   │   └── interface-fornecedores.cy.js # Testes de Interface
│   ├── fixtures/
│   │   └── fornecedores.json           # Dados para testes
│   ├── plugins/
│   │   └── database.js                 # Plugin para acesso ao banco
│   └── support/
│       ├── commands.js                 # Comandos customizados
│       └── e2e.js                      # Configurações globais
├── public/
│   ├── index.html                      # Interface web
│   └── app.js                          # JavaScript frontend
├── server/
│   ├── database.js                     # Classe para conexão SQLite
│   ├── index.js                        # Servidor Express
│   ├── setup-database.js               # Script criação do banco
│   └── seed-database.js                # Script para popular dados
├── cypress.config.js                   # Configuração do Cypress
├── package.json                        # Dependências do projeto
└── database.sqlite                     # Banco SQLite (criado automaticamente)
```

## 🛠️ Instalação e Configuração

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Banco de Dados

```bash
# Criar as tabelas
npm run setup:db

# Popular com dados de exemplo (opcional)
npm run seed:db
```

### 3. Iniciar o Servidor

```bash
# Modo desenvolvimento (com nodemon)
npm run dev

# Ou modo produção
npm start
```

O servidor estará rodando em: http://localhost:3000

## 🧪 Executando os Testes

### Modo Interativo (recomendado para desenvolvimento)

```bash
npm test
# ou
cypress open
```

### Modo Headless (ideal para CI/CD)

```bash
npm run test:headless
# ou
cypress run
```

## 📊 Funcionalidades do Sistema

### CRUD de Fornecedores

- ✅ **Create**: Criar novos fornecedores
- ✅ **Read**: Listar e buscar fornecedores
- ✅ **Update**: Editar fornecedores existentes
- ✅ **Delete**: Remover fornecedores

### Campos do Fornecedor

- **Nome** (obrigatório)
- **Email** (obrigatório, único)
- **Telefone** (opcional)
- **Endereço** (opcional)
- **CNPJ** (opcional, único)
- **Status Ativo** (boolean)
- **Data de Criação** (automático)
- **Data de Atualização** (automático)

## 🎯 Cenários de Teste

### Testes de API (`api-fornecedores.cy.js`)

1. **Operações CRUD via API**

   - Criar fornecedor
   - Buscar por ID
   - Listar todos
   - Atualizar dados
   - Excluir registro

2. **Validações de API**

   - Erro 404 para registros inexistentes
   - Validação de dados inválidos

3. **Integração com Banco**
   - Verificar inserção no banco
   - Validar atualização persistida
   - Confirmar remoção do registro

### Testes de Interface (`interface-fornecedores.cy.js`)

1. **Funcionalidades da Interface**

   - Carregamento da página
   - Listagem de fornecedores
   - Modal de criação/edição
   - Operações CRUD via UI

2. **Validações da Interface**

   - Campos obrigatórios
   - Formato de email
   - Feedback visual

3. **Integração Completa**
   - Interface → API → Banco
   - Verificação end-to-end

## 🔧 API Endpoints

### Fornecedores

- `GET /api/fornecedores` - Listar todos
- `GET /api/fornecedores/:id` - Buscar por ID
- `POST /api/fornecedores` - Criar novo
- `PUT /api/fornecedores/:id` - Atualizar
- `DELETE /api/fornecedores/:id` - Excluir

### Utilitários

- `POST /api/reset-database` - Limpar banco
- `POST /api/seed-database` - Popular dados de teste

## 📝 Comandos Customizados do Cypress

```javascript
// Operações de banco
cy.resetDatabase();
cy.seedDatabase();
cy.queryDatabase(query, parameters);

// Operações de API
cy.criarFornecedor(dados);
cy.buscarFornecedor(id);
cy.atualizarFornecedor(id, dados);
cy.excluirFornecedor(id);
```

## 🎨 Fixtures de Dados

Os testes utilizam fixtures com dados pré-definidos:

- `fornecedorValido` - Dados válidos para criação
- `fornecedorParaEdicao` - Dados para testes de edição
- `fornecedorEditado` - Dados editados
- `fornecedoresBatch` - Array para testes em lote
- `fornecedorInvalido` - Dados inválidos para testes de validação

## 🌟 Diferenciais do Projeto

1. **Integração Completa**: Testes que validam Interface → API → Banco
2. **Fixtures Organizadas**: Dados de teste bem estruturados
3. **Comandos Customizados**: Reutilização de código nos testes
4. **Consultas Diretas**: Validação direta no banco via plugin
5. **Reset Automático**: Banco limpo antes de cada teste
6. **Cobertura Abrangente**: Testes de API, Interface e Integração

## 🔍 Monitoramento e Debug

- **Logs**: Console do servidor mostra todas as operações
- **Cypress Dashboard**: Visualização detalhada dos testes
- **Screenshots**: Capturas automáticas em caso de falha
- **Vídeos**: Gravação dos testes executados

## 📈 Próximos Passos

- [ ] Integração com CI/CD (GitHub Actions)
- [ ] Relatórios de cobertura de testes
- [ ] Testes de performance com Artillery
- [ ] Containerização com Docker
- [ ] Monitoramento com logs estruturados

---

## 🤝 Contribuição

Para contribuir com o projeto:

1. Fork o repositório
2. Crie uma branch para sua feature
3. Faça seus commits
4. Execute os testes
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.
