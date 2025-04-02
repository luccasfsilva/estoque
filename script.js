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
    
    let tableData = inventory.map(item => [
        item.codigo,
        item.nome,
        item.quantidade,
        item.saida,
        item.quantidadeAposSaida,
        item.data,
        item.setor
    ]);

    doc.autoTable({
        head: [["Código", "Nome", "Qtd.", "Saída", "Qtd. Final", "Data", "Setor"]],
        body: tableData,
        startY: 20, 
        theme: "grid", // Aplica um estilo melhor
        styles: { fontSize: 10, cellPadding: 3 },
        headStyles: { fillColor: [50, 50, 150], textColor: 255, fontStyle: "bold" },
        columnStyles: {
            0: { cellWidth: 20 }, 
            1: { cellWidth: 40 },
            2: { cellWidth: 20 },
            3: { cellWidth: 20 },
            4: { cellWidth: 25 },
            5: { cellWidth: 30 },
            6: { cellWidth: 30 }
        }
    });

      doc.save("relatorio_estoque.pdf");
}

// Inicializa a visualização ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    viewInventory();
});
