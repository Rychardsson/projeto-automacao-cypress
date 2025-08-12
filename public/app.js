const API_BASE_URL = 'http://localhost:3000/api';

let editandoFornecedor = false;

// Carregar fornecedores ao iniciar a página
document.addEventListener('DOMContentLoaded', function() {
    carregarFornecedores();
});

// Função para carregar fornecedores
async function carregarFornecedores() {
    try {
        const response = await fetch(`${API_BASE_URL}/fornecedores`);
        const fornecedores = await response.json();
        
        const tbody = document.getElementById('corpoTabela');
        tbody.innerHTML = '';
        
        fornecedores.forEach(fornecedor => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${fornecedor.id}</td>
                <td data-cy="fornecedor-nome">${fornecedor.nome}</td>
                <td data-cy="fornecedor-email">${fornecedor.email}</td>
                <td>${fornecedor.telefone || '-'}</td>
                <td>${fornecedor.cnpj || '-'}</td>
                <td>
                    <span class="badge ${fornecedor.ativo ? 'bg-success' : 'bg-danger'}">
                        ${fornecedor.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                </td>
                <td>
                    <button class="btn btn-sm btn-outline-primary me-1" onclick="editarFornecedor(${fornecedor.id})" data-cy="btn-editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="excluirFornecedor(${fornecedor.id})" data-cy="btn-excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
        
    } catch (error) {
        console.error('Erro ao carregar fornecedores:', error);
        alert('Erro ao carregar fornecedores');
    }
}

// Função para preparar novo fornecedor
function novoFornecedor() {
    editandoFornecedor = false;
    document.getElementById('modalFornecedorLabel').textContent = 'Novo Fornecedor';
    document.getElementById('formFornecedor').reset();
    document.getElementById('fornecedorId').value = '';
    document.getElementById('ativo').checked = true;
}

// Função para editar fornecedor
async function editarFornecedor(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/fornecedores/${id}`);
        const fornecedor = await response.json();
        
        editandoFornecedor = true;
        document.getElementById('modalFornecedorLabel').textContent = 'Editar Fornecedor';
        document.getElementById('fornecedorId').value = fornecedor.id;
        document.getElementById('nome').value = fornecedor.nome;
        document.getElementById('email').value = fornecedor.email;
        document.getElementById('telefone').value = fornecedor.telefone || '';
        document.getElementById('cnpj').value = fornecedor.cnpj || '';
        document.getElementById('endereco').value = fornecedor.endereco || '';
        document.getElementById('ativo').checked = fornecedor.ativo;
        
        const modal = new bootstrap.Modal(document.getElementById('modalFornecedor'));
        modal.show();
        
    } catch (error) {
        console.error('Erro ao carregar fornecedor:', error);
        alert('Erro ao carregar fornecedor');
    }
}

// Função para salvar fornecedor
async function salvarFornecedor() {
    const formData = {
        nome: document.getElementById('nome').value,
        email: document.getElementById('email').value,
        telefone: document.getElementById('telefone').value,
        cnpj: document.getElementById('cnpj').value,
        endereco: document.getElementById('endereco').value,
        ativo: document.getElementById('ativo').checked
    };
    
    try {
        let response;
        
        if (editandoFornecedor) {
            const id = document.getElementById('fornecedorId').value;
            response = await fetch(`${API_BASE_URL}/fornecedores/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
        } else {
            response = await fetch(`${API_BASE_URL}/fornecedores`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
        }
        
        if (response.ok) {
            const modal = bootstrap.Modal.getInstance(document.getElementById('modalFornecedor'));
            modal.hide();
            carregarFornecedores();
            
            // Mostrar mensagem de sucesso
            const mensagem = editandoFornecedor ? 'Fornecedor atualizado com sucesso!' : 'Fornecedor criado com sucesso!';
            mostrarMensagem(mensagem, 'success');
        } else {
            const error = await response.json();
            alert('Erro: ' + error.error);
        }
        
    } catch (error) {
        console.error('Erro ao salvar fornecedor:', error);
        alert('Erro ao salvar fornecedor');
    }
}

// Função para excluir fornecedor
async function excluirFornecedor(id) {
    if (confirm('Tem certeza que deseja excluir este fornecedor?')) {
        try {
            const response = await fetch(`${API_BASE_URL}/fornecedores/${id}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                carregarFornecedores();
                mostrarMensagem('Fornecedor excluído com sucesso!', 'success');
            } else {
                const error = await response.json();
                alert('Erro: ' + error.error);
            }
            
        } catch (error) {
            console.error('Erro ao excluir fornecedor:', error);
            alert('Erro ao excluir fornecedor');
        }
    }
}

// Função para popular dados de teste
async function popularDados() {
    try {
        const response = await fetch(`${API_BASE_URL}/seed-database`, {
            method: 'POST'
        });
        
        if (response.ok) {
            carregarFornecedores();
            mostrarMensagem('Dados de teste inseridos com sucesso!', 'success');
        } else {
            alert('Erro ao popular dados');
        }
        
    } catch (error) {
        console.error('Erro ao popular dados:', error);
        alert('Erro ao popular dados');
    }
}

// Função para mostrar mensagens
function mostrarMensagem(texto, tipo) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${tipo} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${texto}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.querySelector('.container').insertBefore(alertDiv, document.querySelector('.row'));
    
    // Remover automaticamente após 3 segundos
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}
