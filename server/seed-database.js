const Database = require("./database");

async function seedDatabase() {
  const db = new Database();

  try {
    // Limpar dados existentes
    await db.run("DELETE FROM fornecedores");

    // Inserir dados de exemplo
    const fornecedores = [
      {
        nome: "Tech Solutions LTDA",
        email: "contato@techsolutions.com",
        telefone: "(11) 99999-1111",
        endereco: "Rua das Flores, 123 - São Paulo, SP",
        cnpj: "12.345.678/0001-90",
      },
      {
        nome: "Inovação Digital",
        email: "vendas@inovacao.com",
        telefone: "(21) 88888-2222",
        endereco: "Av. Copacabana, 456 - Rio de Janeiro, RJ",
        cnpj: "98.765.432/0001-10",
      },
      {
        nome: "Sistemas Avançados",
        email: "info@sistemasavancados.com",
        telefone: "(31) 77777-3333",
        endereco: "Rua Ouro Preto, 789 - Belo Horizonte, MG",
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

    console.log("Dados de exemplo inseridos com sucesso!");
  } catch (error) {
    console.error("Erro ao inserir dados:", error);
  } finally {
    await db.close();
  }
}

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
