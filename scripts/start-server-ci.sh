#!/bin/bash

# Script para iniciar servidor com logs detalhados em CI

echo "🔧 CI Server Startup Script"
echo "=========================="

# Verificar se o database existe
if [ ! -f "database.sqlite" ]; then
    echo "❌ Database não encontrado! Executando setup..."
    npm run setup
fi

# Verificar porta 3000
if netstat -tlnp 2>/dev/null | grep :3000; then
    echo "⚠️ Porta 3000 já está em uso, tentando liberar..."
    sudo kill -9 $(sudo lsof -t -i:3000) 2>/dev/null || echo "Nenhum processo para matar"
    sleep 2
fi

# Criar diretório para logs
mkdir -p /tmp/ci-logs

# Iniciar servidor com logs
echo "🚀 Iniciando servidor com logging..."
npm start > /tmp/ci-logs/server.log 2>&1 &
SERVER_PID=$!

echo "📝 Server PID: $SERVER_PID"
echo $SERVER_PID > /tmp/server.pid

# Aguardar inicialização
echo "⏳ Aguardando 15 segundos para inicialização..."
sleep 15

# Mostrar logs iniciais
echo "📋 Logs iniciais do servidor:"
echo "=============================="
head -20 /tmp/ci-logs/server.log

# Testar conectividade
echo ""
echo "🔍 Testando conectividade..."
for i in {1..30}; do
    if curl -f http://localhost:3000/api/test >/dev/null 2>&1; then
        echo "✅ Servidor respondendo na tentativa $i"
        break
    else
        echo "❌ Tentativa $i/30 falhou"
        if [ $i -eq 15 ]; then
            echo "🔍 Diagnóstico intermediário:"
            ps aux | grep node | head -3
            echo "Últimas linhas do log:"
            tail -10 /tmp/ci-logs/server.log
        fi
        sleep 2
    fi
    
    if [ $i -eq 30 ]; then
        echo "💥 ERRO: Servidor não respondeu após 30 tentativas"
        echo "📋 Logs completos:"
        cat /tmp/ci-logs/server.log
        exit 1
    fi
done

echo "🎉 Servidor pronto para testes!"
exit 0
