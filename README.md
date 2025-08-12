# 🚀 Pro## 🏗️ **Tecnologias**

- **Cypress** - Framework de testes E2E
- **SQLite** - Banco de dados relacional leve
- **Node.js + Express** - API REST
- **HTML/CSS/JavaScript** - Interface web
- **GitHub Actions** - CI/CD Pipeline
- **ESLint** - Análise de códigoe Automação com Cypress + SQLite + CI/CD

![CI/CD Status](https://github.com/seu-usuario/projeto-automacao-cypress/workflows/🚀%20CI/CD%20-%20Cypress%20Tests%20+%20Deploy/badge.svg)

## 🎯 **Objetivo**

Demonstrar integração completa entre automação de testes com Cypress, consultas diretas em banco de dados SQLite e pipeline CI/CD automatizado, através de um CRUD de fornecedores.

## �️ **Tecnologias**

- **Cypress** - Framework de testes E2E
- **SQLite** - Banco de dados relacional leve
- **Node.js + Express** - API REST
- **HTML/CSS/JavaScript** - Interface web

## 📁 **Estrutura do Projeto**

```
projeto-automacao-cypress/
├── cypress/
│   ├── e2e/
│   │   ├── api-fornecedores.cy.js      # ✅ Testes de API + Banco
│   │   └── interface-fornecedores.cy.js # ✅ Testes de Interface + Integração
│   ├── fixtures/
│   │   └── fornecedores.json           # 📊 Dados para testes
│   └── support/
│       ├── commands.js                 # 🔧 Comandos customizados
│       └── e2e.js                      # ⚙️ Configurações globais
├── server/
│   ├── database.js                     # 🗄️ Classe SQLite
│   ├── index.js                        # 🚀 Servidor Express
│   ├── setup-database.js               # 🛠️ Criação do banco
│   └── reset-database.js               # 🗑️ Reset do banco
├── public/
│   ├── index.html                      # 🌐 Interface web
│   └── app.js                          # 💻 JavaScript frontend
├── cypress.config.js                   # ⚙️ Configuração Cypress
├── package.json                        # 📦 Dependências
└── database.sqlite                     # 💾 Banco SQLite
```

## 🚀 **Como Executar**

### 1. **Instalar Dependências**

```bash
npm install
```

### 2. **Configurar Banco de Dados**

```bash
npm run setup
```

### 3. **Iniciar Servidor**

```bash
# Terminal 1: Servidor
npm start
# ou npm run dev (com nodemon)
```

### 4. **Executar Testes**

```bash
# Terminal 2: Testes
npm test          # Modo interativo
npm run test:run  # Modo headless
```

## ✅ **Funcionalidades Testadas**

### 🔄 **CRUD Completo**

- ✅ **Create** - Criar fornecedores
- ✅ **Read** - Buscar e listar fornecedores
- ✅ **Update** - Editar fornecedores
- ✅ **Delete** - Remover fornecedores

### 🧪 **Tipos de Teste**

#### 1. **Testes de API** (`api-fornecedores.cy.js`)

- ✅ Operações CRUD via API REST
- ✅ Validações de entrada e erros
- ✅ **Consultas diretas no SQLite**
- ✅ Verificação de integridade dos dados

#### 2. **Testes de Interface** (`interface-fornecedores.cy.js`)

- ✅ Interação com elementos da UI
- ✅ Validação de formulários
- ✅ **Integração UI → API → Banco**
- ✅ Sincronização em tempo real

## 🎯 **Diferenciais Implementados**

### 🔍 **Consultas Diretas no Banco**

```javascript
// Exemplo de validação direta no SQLite
cy.queryDatabase("SELECT * FROM fornecedores WHERE id = ?", [id]).then(
  (result) => {
    expect(result[0].nome).to.eq("Nome Esperado");
    expect(result[0].updated_at).to.not.equal(result[0].created_at);
  }
);
```

### 📊 **Fixtures Organizadas**

```javascript
// cypress/fixtures/fornecedores.json
{
  "fornecedorValido": { ... },
  "fornecedorEditado": { ... },
  "fornecedoresLote": [ ... ]
}
```

### 🔧 **Comandos Customizados**

```javascript
// Comandos específicos para o projeto
cy.resetDatabase();
cy.seedDatabase();
cy.criarFornecedor(dados);
cy.queryDatabase(query, params);
```

### 🔄 **Reset Automático**

Banco limpo e populado antes de cada teste com dados das fixtures.

## 📊 **Cenários de Teste**

### ✅ **Validações de API**

- Criação com dados válidos/inválidos
- Busca por ID existente/inexistente
- Atualização com dados válidos
- Exclusão de registros
- Validação de campos únicos (email, CNPJ)

### ✅ **Validações de Interface**

- Carregamento correto da página
- Funcionamento de modais e formulários
- Validação de campos obrigatórios
- Tratamento de erros visuais

### ✅ **Integração Completa**

- **Interface → API → Banco**: Dados criados na UI persistem no banco
- **API → Interface**: Mudanças via API refletem na UI
- **Banco → Validação**: Consultas diretas confirmam alterações

## 🚀 **CI/CD Pipeline**

### 📋 **Overview**

```
Push/PR → Install → Setup DB → Tests → Quality → Deploy → Notify
```

### ⚡ **Features CI/CD**

- 🧪 **Testes Multi-Node**: Execução em Node.js 18.x e 20.x
- 🔍 **Quality Gates**: ESLint + Security Audit
- 🚀 **Deploy Automático**: Para branch main
- 📊 **Relatórios Visuais**: Summary no GitHub
- 🎯 **Matrix Testing**: Diferentes versões e browsers

### 📖 **Documentação Completa**

[📋 **Guia CI/CD Detalhado**](./CI-CD.md)

## 🏆 **Resultados Demonstrados**

1. **✅ CRUD Funcional** - Todas as operações funcionando
2. **✅ Testes de API** - Cobertura completa das rotas
3. **✅ Testes de Interface** - Validação da experiência do usuário
4. **✅ Consultas Diretas** - Verificação no banco de dados
5. **✅ Fixtures Inteligentes** - Dados organizados e reutilizáveis
6. **✅ Integração Total** - UI ↔ API ↔ Banco sincronizados
7. **✅ Pipeline CI/CD** - Automação completa com GitHub Actions

## 🚀 **Comandos Úteis**

```bash
# Desenvolvimento
npm run dev          # Servidor com nodemon
npm start           # Servidor produção
npm run setup       # Configurar banco

# Testes
npm test            # Cypress interativo
npm run test:run    # Cypress headless
npm run ci          # Pipeline completo local

# Qualidade
npm run lint        # Análise de código
npm run lint:fix    # Corrigir problemas

# Específicos
npx cypress run --spec "cypress/e2e/api-fornecedores.cy.js"
npx cypress run --spec "cypress/e2e/interface-fornecedores.cy.js"
```

## 📈 **Métricas do Projeto**

- **13 cenários de teste** cobrindo todas as funcionalidades
- **100% das operações CRUD** testadas via API e Interface
- **Consultas diretas no SQLite** para validação de integridade
- **Fixtures organizadas** com dados realistas
- **Comandos customizados** para reutilização
- **Reset automático** garantindo isolamento dos testes
- **Pipeline CI/CD** com matriz de testes multi-ambiente
- **Quality Gates** com ESLint e Security Audit

---

## 🎯 **Objetivo Alcançado**

✅ **CRUD Simples** - Sistema completo de fornecedores  
✅ **Testes de Interface** - Validação completa da UI  
✅ **Testes de API** - Cobertura de todas as rotas  
✅ **Consultas no Banco** - Verificação direta no SQLite  
✅ **Fixtures Inteligentes** - Dados organizados para testes
✅ **CI/CD Pipeline** - Automação completa com GitHub Actions

**Resultado:** Demonstração completa de automação integrada com banco de dados e CI/CD! 🚀
│ └── app.js # JavaScript frontend
├── server/
│ ├── database.js # Classe para conexão SQLite
│ ├── index.js # Servidor Express
│ ├── setup-database.js # Script criação do banco
│ └── seed-database.js # Script para popular dados
├── cypress.config.js # Configuração do Cypress
├── package.json # Dependências do projeto
└── database.sqlite # Banco SQLite (criado automaticamente)

````

## 🛠️ Instalação e Configuração

### 1. Instalar Dependências

```bash
npm install
````

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
