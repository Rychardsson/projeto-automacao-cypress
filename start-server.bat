@echo off
echo "🚀 Iniciando servidor para testes..."
cd /d "c:\Users\Rycha\OneDrive\Documents\projeto-automacao-cypress"
echo "📁 Diretório atual: %CD%"
echo "🔧 Configurando banco..."
node server/setup-database.js
echo "🌱 Populando dados..."
node server/seed-database.js
echo "🚀 Iniciando servidor..."
node server/index.js
