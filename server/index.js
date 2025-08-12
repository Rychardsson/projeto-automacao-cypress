const express = require("express");
const cors = require("cors");
const path = require("path");
const Database = require("./database");

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

// Instância do banco
const db = new Database();

// Middleware para log das requisições
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Rotas da API

// GET - Listar todos os fornecedores
app.get("/api/fornecedores", async (req, res) => {
  try {
    const fornecedores = await db.all(
      "SELECT * FROM fornecedores ORDER BY id DESC"
    );
    res.json(fornecedores);
  } catch (error) {
    console.error("Erro ao buscar fornecedores:", error);
    res.status(500).json({ error: error.message });
  }
});

// GET - Buscar fornecedor por ID
app.get("/api/fornecedores/:id", async (req, res) => {
  try {
    const fornecedor = await db.get("SELECT * FROM fornecedores WHERE id = ?", [
      req.params.id,
    ]);
    if (!fornecedor) {
      return res.status(404).json({ error: "Fornecedor não encontrado" });
    }
    res.json(fornecedor);
  } catch (error) {
    console.error("Erro ao buscar fornecedor:", error);
    res.status(500).json({ error: error.message });
  }
});

// POST - Criar novo fornecedor
app.post("/api/fornecedores", async (req, res) => {
  const { nome, email, telefone, endereco, cnpj } = req.body;

  // Validações básicas
  if (!nome || !email) {
    return res.status(400).json({ error: "Nome e email são obrigatórios" });
  }

  try {
    const result = await db.run(
      "INSERT INTO fornecedores (nome, email, telefone, endereco, cnpj) VALUES (?, ?, ?, ?, ?)",
      [nome, email, telefone, endereco, cnpj]
    );

    const novoFornecedor = await db.get(
      "SELECT * FROM fornecedores WHERE id = ?",
      [result.id]
    );
    res.status(201).json(novoFornecedor);
  } catch (error) {
    console.error("Erro ao criar fornecedor:", error);
    if (error.message.includes("UNIQUE constraint failed")) {
      res.status(400).json({ error: "Email ou CNPJ já está em uso" });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// PUT - Atualizar fornecedor
app.put("/api/fornecedores/:id", async (req, res) => {
  const { nome, email, telefone, endereco, cnpj, ativo } = req.body;

  try {
    const result = await db.run(
      "UPDATE fornecedores SET nome = ?, email = ?, telefone = ?, endereco = ?, cnpj = ?, ativo = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [
        nome,
        email,
        telefone,
        endereco,
        cnpj,
        ativo !== undefined ? (ativo ? 1 : 0) : 1,
        req.params.id,
      ]
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: "Fornecedor não encontrado" });
    }

    const fornecedorAtualizado = await db.get(
      "SELECT * FROM fornecedores WHERE id = ?",
      [req.params.id]
    );
    res.json(fornecedorAtualizado);
  } catch (error) {
    console.error("Erro ao atualizar fornecedor:", error);
    if (error.message.includes("UNIQUE constraint failed")) {
      res.status(400).json({ error: "Email ou CNPJ já está em uso" });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// DELETE - Remover fornecedor
app.delete("/api/fornecedores/:id", async (req, res) => {
  try {
    const result = await db.run("DELETE FROM fornecedores WHERE id = ?", [
      req.params.id,
    ]);
    if (result.changes === 0) {
      return res.status(404).json({ error: "Fornecedor não encontrado" });
    }
    res.json({ message: "Fornecedor removido com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir fornecedor:", error);
    res.status(500).json({ error: error.message });
  }
});

// Rotas utilitárias para testes

// POST - Resetar banco de dados
app.post("/api/reset", async (req, res) => {
  try {
    await db.run("DELETE FROM fornecedores");
    res.json({ message: "Banco de dados resetado com sucesso" });
  } catch (error) {
    console.error("Erro ao resetar banco:", error);
    res.status(500).json({ error: error.message });
  }
});

// POST - Popular dados de teste
app.post("/api/seed", async (req, res) => {
  try {
    await db.run("DELETE FROM fornecedores");

    const fornecedores = [
      {
        nome: "TechCorp Solutions",
        email: "contato@techcorp.com",
        telefone: "(11) 9999-8888",
        endereco: "Av. Paulista, 1000 - São Paulo/SP",
        cnpj: "12.345.678/0001-90",
      },
      {
        nome: "InnovaTech Ltda",
        email: "vendas@innovatech.com.br",
        telefone: "(21) 8888-7777",
        endereco: "Rua das Flores, 200 - Rio de Janeiro/RJ",
        cnpj: "98.765.432/0001-10",
      },
      {
        nome: "DevSoft Sistemas",
        email: "info@devsoft.com.br",
        telefone: "(31) 7777-6666",
        endereco: "Av. Contorno, 300 - Belo Horizonte/MG",
        cnpj: "11.222.333/0001-44",
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

    const count = await db.get("SELECT COUNT(*) as total FROM fornecedores");
    res.json({ message: `${count.total} fornecedores inseridos com sucesso` });
  } catch (error) {
    console.error("Erro ao popular banco:", error);
    res.status(500).json({ error: error.message });
  }
});

// Tratamento de erros global
app.use((err, req, res, next) => {
  console.error("Erro não tratado:", err);
  res.status(500).json({ error: "Erro interno do servidor" });
});

// Iniciar servidor apenas se executado diretamente
if (require.main === module) {
  app.listen(PORT, () => {
    console.log("🚀 Servidor iniciado com sucesso!");
    console.log(`📍 URL: http://localhost:${PORT}`);
    console.log(`📡 API: http://localhost:${PORT}/api/fornecedores`);
    console.log("✅ Pronto para receber requisições");
  });
}

module.exports = app;
