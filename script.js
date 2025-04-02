let inventory = JSON.parse(localStorage.getItem('inventory')) || [];

// Funções para mostrar formulários
function showAddForm() {
    const formContainer = document.getElementById('form-container');
    formContainer.innerHTML = `
        <h2>Adicionar Item</h2>
        <form onsubmit="addItem(event)">
            <input type="text" id="codigo" placeholder="Código" required>
            <input type="text" id="nome" placeholder="Nome" required>
            <input type="number" id="quantidade" placeholder="Quantidade" required>
            <input type="number" id="saida" placeholder="Saída">
            <input type="date" id="data" required>
            <input type="text" id="setor" placeholder="Setor" required>
            <button type="submit">Salvar</button>
        </form>
    `;
}

function showUpdateForm() {
    const formContainer = document.getElementById('form-container');
    formContainer.innerHTML = `
        <h2>Atualizar Item</h2>
        <form onsubmit="updateItem(event)">
            <input type="text" id="update-codigo" placeholder="Código do item" required>
            <input type="number" id="new-quantidade" placeholder="Nova quantidade">
            <input type="number" id="new-saida" placeholder="Nova saída">
            <button type="submit">Atualizar</button>
        </form>
    `;
}

function showRemoveForm() {
    const formContainer = document.getElementById('form-container');
    formContainer.innerHTML = `
        <h2>Remover Item</h2>
        <form onsubmit="removeItem(event)">
            <input type="text" id="remove-codigo" placeholder="Código do item" required>
            <button type="submit">Remover</button>
        </form>
    `;
}

// Funções CRUD
function addItem(event) {
    event.preventDefault();
    const newItem = {
        codigo: document.getElementById('codigo').value,
        nome: document.getElementById('nome').value,
        quantidade: parseInt(document.getElementById('quantidade').value),
        saida: parseInt(document.getElementById('saida').value) || 0,
        quantidadeAposSaida: parseInt(document.getElementById('quantidade').value) - (parseInt(document.getElementById('saida').value) || 0),
        data: document.getElementById('data').value,
        setor: document.getElementById('setor').value
    };
    
    inventory.push(newItem);
    saveToLocalStorage();
    viewInventory();
    document.getElementById('form-container').innerHTML = '';
}

function updateItem(event) {
    event.preventDefault();
    const codigo = document.getElementById('update-codigo').value;
    const item = inventory.find(item => item.codigo === codigo);
    
    if (item) {
        const newQtd = document.getElementById('new-quantidade').value;
        const newSaida = document.getElementById('new-saida').value;
        
        if (newQtd) item.quantidade = parseInt(newQtd);
        if (newSaida) item.saida = parseInt(newSaida);
        item.quantidadeAposSaida = item.quantidade - item.saida;
        
        saveToLocalStorage();
        viewInventory();
        document.getElementById('form-container').innerHTML = '';
    }
}

function removeItem(event) {
    event.preventDefault();
    const codigo = document.getElementById('remove-codigo').value;
    inventory = inventory.filter(item => item.codigo !== codigo);
    saveToLocalStorage();
    viewInventory();
    document.getElementById('form-container').innerHTML = '';
}

// Funções auxiliares
function saveToLocalStorage() {
    localStorage.setItem('inventory', JSON.stringify(inventory));
}

function viewInventory() {
    const inventoryContainer = document.getElementById('inventory-container');
    inventoryContainer.innerHTML = `
        <h2>Estoque Atual</h2>
        <table>
            <tr>
                <th>Código</th>
                <th>Nome</th>
                <th>Qtd. Inicial</th>
                <th>Saída</th>
                <th>Qtd. Final</th>
                <th>Data</th>
                <th>Setor</th>
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

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    viewInventory();
});
