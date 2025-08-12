const Database = require('./server/database');

async function testeSimples() {
  console.log('Testando conexão com banco...');
  
  const db = new Database();
  
  try {
    const fornecedores = await db.all('SELECT * FROM fornecedores');
    console.log('Fornecedores encontrados:', fornecedores.length);
    console.log('Dados:', fornecedores);
  } catch (error) {
    console.error('Erro:', error);
  }
  
  await db.close();
}

testeSimples();
