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
    inventoryContainer.innerHTML = '';

    if (inventory.length === 0) {
        inventoryContainer.innerHTML = '<p>Nenhum item no estoque.</p>';
        return;
    }

    // Gera e exibe o PDF diretamente ao clicar no botão
    function gerarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.text("Relatório de Estoque", 14, 15);

    const dadosTabela = inventory.map((item) => [
        item.codigo,
        item.nome,
        item.quantidade,
        item.saida,
        item.quantidadeAposSaida,
        item.data,
        item.setor
    ]);

    doc.autoTable({
        head: [["Código", "Nome", "Qtd", "Saída", "Qtd Após Saída", "Data", "Setor"]],
        body: dadosTabela,
        startY: 20,
    });

    doc.output("dataurlnewwindow"); // Abre o PDF numa nova aba
}



// Inicializa a visualização ao carregar a página

document.addEventListener('DOMContentLoaded', function() {

    viewInventory();

});
