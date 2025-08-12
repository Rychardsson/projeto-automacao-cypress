const Database = require("./database");

async function setupDatabase() {
  const db = new Database();

  try {
    // Criar tabela de fornecedores
    await db.run(`
      CREATE TABLE IF NOT EXISTS fornecedores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        telefone TEXT,
        endereco TEXT,
        cnpj TEXT UNIQUE,
        ativo BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("Tabela fornecedores criada com sucesso!");
  } catch (error) {
    console.error("Erro ao criar tabelas:", error);
  } finally {
    await db.close();
  }
}

if (require.main === module) {
  setupDatabase();
}

module.exports = setupDatabase;
