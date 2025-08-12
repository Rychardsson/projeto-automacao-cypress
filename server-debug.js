const express = require('express');
const cors = require('cors');
const path = require('path');

console.log('🔧 Iniciando servidor...');

try {
  const Database = require('./server/database');
  console.log('✅ Database importado com sucesso');

  const app = express();
  const PORT = process.env.PORT || 3000;

  // Middlewares
  app.use(cors());
  app.use(express.json());
  app.use(express.static(path.join(__dirname, 'public')));

  console.log('✅ Middlewares configurados');

  // Instância do banco
  const db = new Database();
  console.log('✅ Instância do banco criada');

  // Rota de teste simples
  app.get('/api/test', (req, res) => {
    res.json({ message: 'Servidor funcionando!' });
  });

  // GET - Listar todos os fornecedores
  app.get('/api/fornecedores', async (req, res) => {
    try {
      console.log('📡 Requisição recebida para /api/fornecedores');
      const fornecedores = await db.all('SELECT * FROM fornecedores ORDER BY id DESC');
      console.log('✅ Fornecedores encontrados:', fornecedores.length);
      res.json(fornecedores);
    } catch (error) {
      console.error('❌ Erro ao buscar fornecedores:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // POST - Reset para testes
  app.post('/api/reset', async (req, res) => {
    try {
      await db.run('DELETE FROM fornecedores');
      res.json({ message: 'Banco resetado com sucesso' });
    } catch (error) {
      console.error('❌ Erro ao resetar banco:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Iniciar servidor
  const server = app.listen(PORT, () => {
    console.log('🚀 Servidor iniciado com sucesso!');
    console.log(`📍 URL: http://localhost:${PORT}`);
    console.log(`📡 API: http://localhost:${PORT}/api/fornecedores`);
    console.log(`🧪 Teste: http://localhost:${PORT}/api/test`);
    console.log('✅ Pronto para receber requisições');
  });

  // Tratamento de erros do servidor
  server.on('error', (err) => {
    console.error('❌ Erro no servidor:', err);
  });

} catch (error) {
  console.error('❌ Erro fatal ao iniciar servidor:', error);
  process.exit(1);
}
