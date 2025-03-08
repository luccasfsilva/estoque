let inventory = JSON.parse(localStorage.getItem('inventory')) || [];

function saveToLocalStorage() {
    localStorage.setItem('inventory', JSON.stringify(inventory));
}

function showAddForm() {
    const formContainer = document.getElementById('form-container');
    formContainer.innerHTML = `
        <h2>Adicionar Item</h2>
        <form id="addForm">
            <input type="text" id="codigo" placeholder="Código do Produto" required>
            <input type="text" id="nome" placeholder="Nome do Item" required>
            <input type="number" id="quantidade" placeholder="Quantidade" required>
            <input type="number" id="saida" placeholder="Quantidade de Saída" required>
            <input type="date" id="data" required>
            <input type="text" id="setor" placeholder="Setor" required>
            <button type="submit">Adicionar</button>
        </form>
    `;

    document.getElementById('addForm').addEventListener('submit', function(e) {
        e.preventDefault();
        let codigo = document.getElementById('codigo').value;
        let nome = document.getElementById('nome').value;
        let quantidade = parseInt(document.getElementById('quantidade').value);
        let saida = parseInt(document.getElementById('saida').value);
        let data = document.getElementById('data').value;
        let setor = document.getElementById('setor').value;
        let quantidadeAposSaida = quantidade - saida;

        adicionarItem(codigo, nome, quantidade, saida, quantidadeAposSaida, data, setor);
        formContainer.innerHTML = '';
    });
}

function adicionarItem(codigo, nome, quantidade, saida, quantidadeAposSaida, data, setor) {
    inventory.push({ codigo, nome, quantidade, saida, quantidadeAposSaida, data, setor });
    saveToLocalStorage();
    viewInventory(); // 🔥 Atualiza a tabela automaticamente
}

function showUpdateForm() {
    const formContainer = document.getElementById('form-container');
    formContainer.innerHTML = `
        <h2>Atualizar Item</h2>
        <form id="updateForm">
            <input type="text" id="codigo" placeholder="Código do Produto" required>
            <input type="number" id="quantidade" placeholder="Nova Quantidade" required>
            <input type="number" id="saida" placeholder="Nova Quantidade de Saída" required>
            <input type="date" id="data" required>
            <input type="text" id="setor" placeholder="Setor" required>
            <button type="submit">Atualizar</button>
        </form>
    `;

    document.getElementById('updateForm').addEventListener('submit', function(e) {
        e.preventDefault();
        let codigo = document.getElementById('codigo').value;
        let quantidade = parseInt(document.getElementById('quantidade').value);
        let saida = parseInt(document.getElementById('saida').value);
        let data = document.getElementById('data').value;
        let setor = document.getElementById('setor').value;
        atualizarItem(codigo, quantidade, saida, data, setor);
        formContainer.innerHTML = '';
    });
}

function atualizarItem(codigo, quantidade, saida, data, setor) {
    let itemAtualizado = false;
    for (let i = 0; i < inventory.length; i++) {
        if (inventory[i].codigo === codigo) {
            inventory[i].quantidade = quantidade;
            inventory[i].saida = saida;
            inventory[i].quantidadeAposSaida = quantidade - saida;
            inventory[i].data = data;
            inventory[i].setor = setor;
            itemAtualizado = true;
            break;
        }
    }
    if (itemAtualizado) {
        saveToLocalStorage();
        viewInventory(); // 🔥 Atualiza a tabela automaticamente
    } else {
        alert('Item não encontrado!');
    }
}

function showRemoveForm() {
    const formContainer = document.getElementById('form-container');
    formContainer.innerHTML = `
        <h2>Remover Item</h2>
        <form id="removeForm">
            <input type="text" id="codigoRemover" placeholder="Código do Produto" required>
            <button type="submit">Remover</button>
        </form>
    `;

    document.getElementById('removeForm').addEventListener('submit', function(e) {
        e.preventDefault();
        let codigo = document.getElementById('codigoRemover').value;
        removerItem(codigo);
        formContainer.innerHTML = '';
    });
}

function removerItem(codigo) {
    let novoInventory = inventory.filter(item => item.codigo !== codigo);

    if (novoInventory.length !== inventory.length) {
        inventory = novoInventory;
        saveToLocalStorage();
        viewInventory(); // 🔥 Atualiza a tabela automaticamente
    } else {
        alert('Código não encontrado!');
    }
}

function viewInventory() {
    const inventoryContainer = document.getElementById('inventory-container');
    inventoryContainer.innerHTML = `
        <h2>Itens no Estoque</h2>
        <table>
            <tr>
                <th>Código</th>
                <th>Nome</th>
                <th>Quantidade</th>
                <th>Saída</th>
                <th>Quantidade Após Saída</th>
                <th>Data</th>
                <th>Setor Destinado</th>
            </tr>
            ${inventory.map(item => `
                <tr>
                    <td>${item.codigo}</td>
                    <td>${item.nome}</td>
                    <td>${item.quantidade}</td>
                    <td>${item.saida}</td>
                    <td>${item.quantidadeAposSaida}</td>
                    <td>${item.data}</td>
                    <td>${item.setor}</td>
                </tr>
            `).join('')}
        </table>
    `;
}

// Inicializa a visualização ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    viewInventory();
});
