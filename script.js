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

function viewInventory() {
    const inventoryContainer = document.getElementById('inventory-container');
    inventoryContainer.innerHTML = `
        <h2>Itens no Estoque</h2>
        <table id="inventory-table">
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
        <button onclick="generatePDF()">Gerar PDF</button>
    `;
}

function generatePDF() {
    const { jsPDF } = window.jspdf;
    let doc = new jsPDF();

    doc.text("Relatório de Estoque", 10, 10);
    let y = 20;
    
    const table = document.querySelector("#inventory-table");
    if (table) {
        let rows = table.querySelectorAll("tr");
        rows.forEach((row, index) => {
            let cols = row.querySelectorAll("td, th");
            let text = "";
            cols.forEach(col => {
                text += col.innerText + " \t ";
            });
            doc.text(text, 10, y);
            y += 10;
        });
    }
    
    doc.save("estoque.pdf");
}

document.addEventListener('DOMContentLoaded', function() {
    viewInventory();
});
