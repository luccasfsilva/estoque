let inventory = JSON.parse(localStorage.getItem('inventory')) || [];

function saveToLocalStorage() {
    localStorage.setItem('inventory', JSON.stringify(inventory));
}

function viewInventory() {
    const inventoryContainer = document.getElementById('inventory-container');
    if (!inventoryContainer) return;
    
    inventoryContainer.innerHTML = `
        <h2>Itens no Estoque</h2>
        <table border="1" cellspacing="0" cellpadding="5">
            <tr>
                <th>Código</th>
                <th>Nome</th>
                <th>Qtd.</th>
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

function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    doc.setFont("helvetica", "bold");
    doc.text("Relatório de Estoque", 14, 10);
    doc.setFont("helvetica", "normal");

    let startY = 20;
    
    // Cabeçalho da Tabela
    let headers = ["Código", "Nome", "Qtd.", "Saída", "Qtd. Final", "Data", "Setor"];
    let columnWidths = [20, 40, 20, 20, 25, 30, 25];  // Ajuste os tamanhos aqui

    let startX = 10;
    headers.forEach((header, i) => {
        doc.text(header, startX, startY);
        startX += columnWidths[i];
    });

    startY += 10; // Pula linha após cabeçalho

    // Dados da Tabela
    inventory.forEach(item => {
        let startX = 10;
        let row = [item.codigo, item.nome, item.quantidade, item.saida, item.quantidadeAposSaida, item.data, item.setor];
        
        row.forEach((text, i) => {
            doc.text(String(text), startX, startY);
            startX += columnWidths[i];
        });

        startY += 8; // Espaçamento entre as linhas
    });

    doc.save("relatorio_estoque.pdf");
}

// Inicializa o estoque automaticamente ao carregar
document.addEventListener('DOMContentLoaded', function() {
    viewInventory();
});
