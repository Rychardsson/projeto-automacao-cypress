const Database = require("./database");

async function resetDatabase() {
  const db = new Database();

  try {
    console.log("🗑️ Resetando banco de dados...");
    await db.run("DELETE FROM fornecedores");
    console.log("✅ Banco de dados resetado com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao resetar banco:", error);
  } finally {
    await db.close();
  }
}

if (require.main === module) {
  resetDatabase();
}

module.exports = resetDatabase;
