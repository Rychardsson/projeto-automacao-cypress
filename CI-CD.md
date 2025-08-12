# 🔄 CI/CD com GitHub Actions

## 📋 Visão Geral

Este projeto possui integração completa com **GitHub Actions** para automação de testes e deploy. O pipeline executa automaticamente a cada push e pull request.

## 🚀 Configuração do Pipeline

### 📂 Estrutura

```
.github/
└── workflows/
    └── ci-cd.yml      # Pipeline principal
```

### ⚡ Triggers

- **Push**: branches `main` e `develop`
- **Pull Request**: para branch `main`
- **Manual**: através do GitHub UI

## 🔄 Jobs do Pipeline

### 1. 🧪 Cypress Tests

- **Matrix Strategy**: Node.js 18.x e 20.x
- **Browser**: Chrome
- **Configuração**: Setup automático do banco SQLite
- **Artifacts**: Screenshots, vídeos e relatórios
- **Timeout**: 120 segundos para startup

### 2. 🔍 Quality & Security

- **ESLint**: Análise de código
- **Security Audit**: Verificação de vulnerabilidades
- **Bundle Size**: Análise de tamanho do projeto

### 3. 🚀 Deploy

- **Trigger**: Apenas na branch `main`
- **Environment**: Production
- **Database**: Setup automático
- **Providers**: Suporte para Heroku/Vercel (comentado)

### 4. 📢 Notifications

- **Summary**: Relatório visual no GitHub
- **Status**: Resultado de todos os jobs
- **Metadata**: Info do commit e branch

## ⚙️ Configuração de Secrets

Para funcionalidade completa, configure os seguintes secrets no GitHub:

```bash
CYPRESS_RECORD_KEY    # Para Cypress Dashboard (opcional)
HEROKU_API_KEY       # Para deploy no Heroku (opcional)
VERCEL_TOKEN         # Para deploy no Vercel (opcional)
```

### Como configurar secrets:

1. Vá para `Settings > Secrets and variables > Actions`
2. Clique em `New repository secret`
3. Adicione os secrets necessários

## 📊 Monitoramento

### Status Badges

Adicione ao README principal:

```markdown
![CI/CD](https://github.com/seu-usuario/projeto-automacao-cypress/workflows/🚀%20CI/CD%20-%20Cypress%20Tests%20+%20Deploy/badge.svg)
```

### Dashboard do Cypress

Se configurado, acesse: [Cypress Dashboard](https://dashboard.cypress.io/)

## 🛠️ Customização

### Adicionar Novos Ambientes

```yaml
- name: 🌍 Deploy to Staging
  if: github.ref == 'refs/heads/develop'
  run: |
    echo "Deploy para ambiente de staging"
```

### Configurar Notificações Slack

```yaml
- name: 📱 Slack Notification
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### Matrix Testing com Diferentes Browsers

```yaml
strategy:
  matrix:
    browser: [chrome, firefox, edge]
    node-version: [18.x, 20.x]
```

## 🐛 Troubleshooting

### Testes Falhando

1. Verifique os logs do job no GitHub Actions
2. Baixe os artifacts para ver screenshots/vídeos
3. Execute localmente: `npm run cypress:run`

### Deploy Falhando

1. Verifique as configurações de secrets
2. Confirme permissões do token
3. Teste o deploy manual primeiro

### Performance Lenta

1. Use cache do Node.js (já configurado)
2. Considere usar `npm ci` ao invés de `npm install`
3. Otimize os testes Cypress

## 📈 Métricas

O pipeline automaticamente gera:

- ✅ Status dos testes por versão do Node
- 📊 Relatório de qualidade de código
- 🎯 Summary visual no GitHub
- 📦 Análise de tamanho do bundle

## 🔧 Comandos Locais

Para testar o pipeline localmente:

```bash
# Instalar act (GitHub Actions local runner)
winget install nektos.act

# Executar o pipeline
act -j cypress-tests

# Executar job específico
act -j quality-checks
```

## 📚 Recursos Adicionais

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Cypress GitHub Actions Guide](https://docs.cypress.io/guides/continuous-integration/github-actions)
- [Advanced Workflow Patterns](https://docs.github.com/en/actions/using-workflows/advanced-workflow-features)
