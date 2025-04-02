let inventory = JSON.parse(localStorage.getItem('inventory')) || [];

function saveToLocalStorage() {
    localStorage.setItem('inventory', JSON.stringify(inventory));
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
        <button onclick="generatePDF()">Gerar PDF</button>
    `;
}

function generatePDF() {
    const { jsPDF } = window.jspdf;
    let doc = new jsPDF();

    doc.text("Relatório de Estoque", 10, 10);
    let startY = 20;
    
    inventory.forEach((item, index) => {
        doc.text(`Código: ${item.codigo} | Nome: ${item.nome} | Qtde: ${item.quantidade} | Saída: ${item.saida} | Após Saída: ${item.quantidadeAposSaida} | Data: ${item.data} | Setor: ${item.setor}`, 10, startY + (index * 10));
    });
    
    doc.output("dataurlnewwindow");
}

document.addEventListener('DOMContentLoaded', function() {
    viewInventory();
});
