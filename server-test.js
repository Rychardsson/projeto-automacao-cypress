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

// Instância do banco
let db;

// Inicializar banco
async function initDatabase() {
  try {
    db = new Database();
    console.log("Database inicializado com sucesso");
  } catch (error) {
    console.error("Erro ao inicializar banco:", error);
    process.exit(1);
  }
}

// Middleware para verificar se DB está disponível
function checkDb(req, res, next) {
  if (!db) {
    return res.status(500).json({ error: "Database não inicializado" });
  }
  next();
}

// Rotas para Fornecedores

// GET - Listar todos os fornecedores
app.get("/api/fornecedores", checkDb, async (req, res) => {
  try {
    const fornecedores = await db.all(
      "SELECT * FROM fornecedores ORDER BY created_at DESC"
    );
    res.json(fornecedores);
  } catch (error) {
    console.error("Erro ao buscar fornecedores:", error);
    res.status(500).json({ error: error.message });
  }
});

// GET - Buscar fornecedor por ID
app.get("/api/fornecedores/:id", checkDb, async (req, res) => {
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

// Inicializar servidor
async function startServer() {
  await initDatabase();

  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Acesse: http://localhost:${PORT}`);
  });
}

// Tratamento de erros não capturados
process.on("uncaughtException", (err) => {
  console.error("Erro não capturado:", err);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.error("Promise rejeitada:", err);
  process.exit(1);
});

startServer().catch(console.error);
