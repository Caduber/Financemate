document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("modal");
    const modalTitle = document.getElementById("modalTitle");
    const formulario = document.getElementById("formulario");
    let endpoint = "";
    let editingId = null;

    function abrirModal(tipo, dados = null) {
    if (dados) {
        modalTitle.innerText = "Editar Movimentação";
        document.getElementById("valor").value = dados.valor;
        document.getElementById("data").value = dados.data;
        document.getElementById("categoria").value = dados.categoria;
        endpoint = tipo;  // Mantém o endpoint correto (entradas ou saidas)
        editingId = dados.id;
    } else {
        modalTitle.innerText = tipo === "entrada" ? "Cadastrar Entrada" : "Cadastrar Saída";
        
        editingId = null;
        limparFormulario();
    }
    modal.style.display = "flex";
}


    function limparFormulario() {
        document.getElementById("valor").value = "";
        document.getElementById("data").value = "";
        document.getElementById("categoria").value = "";
    }

    function fecharModal() {
        modal.style.display = "none";
        limparFormulario();
        location.reload();
    }

    modal.addEventListener("click", function (event) {
        if (event.target === modal) {
            fecharModal();
        }
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            fecharModal();
        }
    });

    document.getElementById("botaoReceita").addEventListener("click", function () {
        abrirModal("entrada");
    });

    document.getElementById("botaoDespesa").addEventListener("click", function () {
        abrirModal("saida");
    });

    formulario.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!endpoint) {
        alert("Erro: Tipo de movimentação não definido.");
        return;
    }

    const dados = {
        valor: parseFloat(document.getElementById("valor").value),
        data: document.getElementById("data").value,
        categoria: document.getElementById("categoria").value,
    };

    const metodo = editingId ? "PUT" : "POST";
    const url = editingId ? `http://localhost:8080/${endpoint}/${editingId}` : `http://localhost:8080/${endpoint}`;

    fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
    })
    .then(response => {
        if (!response.ok) throw new Error(`Erro ao salvar ${modalTitle.innerText}`);
        return response.json();
    })
    .then(data => {
        alert(`${modalTitle.innerText} salva com sucesso!`);
        fecharModal();
    })
    .catch(error => console.error("Erro:", error));
});


    function carregarDados(endpoint, tipo) {
        fetch(`http://localhost:8080/${endpoint}`)
            .then(response => response.json())
            .then(dados => {
                const tabelaBody = document.querySelector("#tabela tbody");

                dados.forEach(item => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${tipo}</td>
                        <td>${item.valor}</td>
                        <td>${item.data}</td>
                        <td>${item.categoria}</td>
                        <td>
                            <button onclick="editarItem('${endpoint}', ${item.id})">✏️</button>
                            <button onclick="excluirItem('${endpoint}', ${item.id})">🗑️</button>

                        </td>
                    `;
                    tabelaBody.appendChild(row);
                });
            })
            .catch(error => console.error(`Erro ao buscar ${tipo.toLowerCase()}s:`, error));
    }

    window.editarItem = function (endpoint, id) {
    fetch(`http://localhost:8080/${endpoint}/${id}`)
        .then(response => response.json())
        .then(dados => {
            alert(dados)
            abrirModal(endpoint, { ...dados, id });
        })
        .catch(error => console.error("Erro ao buscar item:", error));
};


    window.excluirItem = function (endpoint, id) {
        if (confirm("Tem certeza que deseja excluir esta movimentação?")) {
            fetch(`http://localhost:8080/${endpoint}/${id}`, { method: "DELETE" })
                .then(response => {
                    if (!response.ok) throw new Error("Erro ao excluir");
                    alert("Movimentação excluída com sucesso!");
                    location.reload();
                })
                .catch(error => console.error("Erro:", error));
        }
    };

    carregarDados("entradas", "Entrada");
    carregarDados("saidas", "Saída");
});
    