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
    viewInventory();
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
        viewInventory();
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
        viewInventory();
    } else {
        alert('Código não encontrado!');
    }
}

function viewInventory() {
    const inventoryContainer = document.getElementById('inventory-container');
    inventoryContainer.innerHTML = `
        <h2>Itens no Estoque</h2>
        <table border="1">
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

// Função para gerar PDF
function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFont("helvetica", "bold");
    doc.text("Relatório de Estoque", 20, 10);

    let y = 20; // Posição inicial no PDF
    doc.setFont("helvetica", "normal");

    // Cabeçalho da tabela
    doc.text("Código", 10, y);
    doc.text("Nome", 40, y);
    doc.text("Qtd.", 80, y);
    doc.text("Saída", 100, y);
    doc.text("Qtd. Final", 120, y);
    doc.text("Data", 140, y);
    doc.text("Setor", 160, y);
    y += 10;

    // Adicionando os itens do estoque
    inventory.forEach(item => {
        doc.text(item.codigo, 10, y);
        doc.text(item.nome, 40, y);
        doc.text(String(item.quantidade), 80, y);
        doc.text(String(item.saida), 100, y);
        doc.text(String(item.quantidadeAposSaida), 120, y);
        doc.text(item.data, 140, y);
        doc.text(item.setor, 160, y);
        y += 10;
    });

    doc.save("relatorio_estoque.pdf");
}

// Inicializa a visualização ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    viewInventory();
});
