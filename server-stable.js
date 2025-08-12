const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const Database = require("./server/database");

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Tratamento de erros para evitar crashes
process.on('uncaughtException', (err) => {
  console.error('Erro não capturado:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('Promise rejeitada:', err);
});

// Instância do banco
let db;

async function initServer() {
  try {
    db = new Database();
    console.log('✅ Database conectado');

    // GET - Listar todos os fornecedores
    app.get("/api/fornecedores", async (req, res) => {
      try {
        const fornecedores = await db.all("SELECT * FROM fornecedores ORDER BY created_at DESC");
        res.json(fornecedores);
      } catch (error) {
        console.error('Erro ao listar fornecedores:', error);
        res.status(500).json({ error: error.message });
      }
    });

    // GET - Buscar fornecedor por ID
    app.get("/api/fornecedores/:id", async (req, res) => {
      try {
        const fornecedor = await db.get("SELECT * FROM fornecedores WHERE id = ?", [req.params.id]);
        if (!fornecedor) {
          return res.status(404).json({ error: "Fornecedor não encontrado" });
        }
        res.json(fornecedor);
      } catch (error) {
        console.error('Erro ao buscar fornecedor:', error);
        res.status(500).json({ error: error.message });
      }
    });

    // POST - Criar novo fornecedor
    app.post("/api/fornecedores", async (req, res) => {
      const { nome, email, telefone, endereco, cnpj } = req.body;
      
      try {
        const result = await db.run(
          "INSERT INTO fornecedores (nome, email, telefone, endereco, cnpj) VALUES (?, ?, ?, ?, ?)",
          [nome, email, telefone, endereco, cnpj]
        );
        
        const novoFornecedor = await db.get("SELECT * FROM fornecedores WHERE id = ?", [result.id]);
        res.status(201).json(novoFornecedor);
      } catch (error) {
        console.error('Erro ao criar fornecedor:', error);
        res.status(400).json({ error: error.message });
      }
    });

    // PUT - Atualizar fornecedor
    app.put("/api/fornecedores/:id", async (req, res) => {
      const { nome, email, telefone, endereco, cnpj, ativo = true } = req.body;
      
      try {
        await db.run(
          "UPDATE fornecedores SET nome = ?, email = ?, telefone = ?, endereco = ?, cnpj = ?, ativo = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
          [nome, email, telefone, endereco, cnpj, ativo ? 1 : 0, req.params.id]
        );
        
        const fornecedorAtualizado = await db.get("SELECT * FROM fornecedores WHERE id = ?", [req.params.id]);
        res.json(fornecedorAtualizado);
      } catch (error) {
        console.error('Erro ao atualizar fornecedor:', error);
        res.status(400).json({ error: error.message });
      }
    });

    // DELETE - Remover fornecedor
    app.delete("/api/fornecedores/:id", async (req, res) => {
      try {
        const result = await db.run("DELETE FROM fornecedores WHERE id = ?", [req.params.id]);
        if (result.changes === 0) {
          return res.status(404).json({ error: "Fornecedor não encontrado" });
        }
        res.json({ message: "Fornecedor removido com sucesso" });
      } catch (error) {
        console.error('Erro ao excluir fornecedor:', error);
        res.status(500).json({ error: error.message });
      }
    });

    // POST - Resetar dados
    app.post("/api/reset-database", async (req, res) => {
      try {
        await db.run("DELETE FROM fornecedores");
        res.json({ message: "Database resetado com sucesso" });
      } catch (error) {
        console.error('Erro ao resetar database:', error);
        res.status(500).json({ error: error.message });
      }
    });

    // POST - Popular dados de teste
    app.post("/api/seed-database", async (req, res) => {
      try {
        const seedDatabase = require("./server/seed-database");
        await seedDatabase();
        res.json({ message: "Dados de teste inseridos com sucesso" });
      } catch (error) {
        console.error('Erro ao popular database:', error);
        res.status(500).json({ error: error.message });
      }
    });

    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`🌐 Acesse: http://localhost:${PORT}`);
      console.log(`📡 API: http://localhost:${PORT}/api/fornecedores`);
    });

  } catch (error) {
    console.error('❌ Erro ao inicializar servidor:', error);
    process.exit(1);
  }
}

initServer();
