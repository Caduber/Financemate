document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("modal");
    const modalTitle = document.getElementById("modalTitle");
    const formulario = document.getElementById("formulario");
    let endpoint = "";
    let editingId = null;

    // Variáveis para armazenar os dados carregados
    let dadosEntradas = [];
    let dadosSaidas = [];

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
            endpoint = tipo;
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
        abrirModal("entradas");
    });

    document.getElementById("botaoDespesa").addEventListener("click", function () {
        abrirModal("saidas");
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
        const url = editingId 
                      ? `http://localhost:8080/${endpoint}/${editingId}` 
                      : `http://localhost:8080/${endpoint}`;

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

    // Função para carregar dados e armazená-los para cálculos
    async function carregarDados(endpoint, tipo) {
        return fetch(`http://localhost:8080/${endpoint}`)
            .then(response => response.json())
            .then(dados => {
                // Armazena os dados para uso nas agregações
                if (endpoint === "entradas") {
                    dadosEntradas = dados;
                } else if (endpoint === "saidas") {
                    dadosSaidas = dados;
                }
                // Popula a tabela (se necessário)
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
                    atualizarCards(dadosEntradas, dadosSaidas);
                });
            })
            .catch(error => console.error(`Erro ao buscar ${tipo.toLowerCase()}s:`, error));
    }

    // Função para calcular as agregações e atualizar os cards
    function atualizarCards(entradas, saidas) {
        // Cálculos para receitas
        let totalReceita = 0, menorReceita = Infinity, maiorReceita = -Infinity;
        let menorReceitaCategoria = "", maiorReceitaCategoria = "";
        entradas.forEach(item => {
            totalReceita += item.valor;
            if (item.valor < menorReceita) {
                menorReceita = item.valor;
                menorReceitaCategoria = item.categoria;
            }
            if (item.valor > maiorReceita) {
                maiorReceita = item.valor;
                maiorReceitaCategoria = item.categoria;
            }
        });

        // Cálculos para despesas
        let totalDespesa = 0, menorDespesa = Infinity, maiorDespesa = -Infinity;
        let menorDespesaCategoria = "", maiorDespesaCategoria = "";
        saidas.forEach(item => {
            totalDespesa += item.valor;
            if (item.valor < menorDespesa) {
                menorDespesa = item.valor;
                menorDespesaCategoria = item.categoria;
            }
            if (item.valor > maiorDespesa) {
                maiorDespesa = item.valor;
                maiorDespesaCategoria = item.categoria;
            }
        });

        // Considerando que as despesas serão exibidas com sinal negativo
        let saldo = totalReceita - totalDespesa;

        // Atualiza os elementos do DOM
        document.getElementById("receita").innerHTML = `<h1>R$ ${totalReceita.toFixed(2)}</h1>`;
        document.getElementById("despesa").innerHTML = `<h1>R$ -${totalDespesa.toFixed(2)}</h1>`;
        document.getElementById("saldo").innerHTML = `<h1>R$ ${saldo.toFixed(2)}</h1>`;

        document.getElementById("menorReceita").innerText = menorReceita !== Infinity ? 
            `${menorReceitaCategoria}: R$ ${menorReceita.toFixed(2)}` : "-";
        document.getElementById("maiorReceita").innerText = maiorReceita !== -Infinity ? 
            `${maiorReceitaCategoria}: R$ ${maiorReceita.toFixed(2)}` : "-";

        document.getElementById("menorDespesa").innerText = menorDespesa !== Infinity ? 
            `${menorDespesaCategoria}: R$ ${menorDespesa.toFixed(2)}` : "-";
        document.getElementById("maiorDespesa").innerText = maiorDespesa !== -Infinity ? 
            `${maiorDespesaCategoria}: R$ ${maiorDespesa.toFixed(2)}` : "-";
    }

    // Funções globais para editar e excluir (permanece igual)
    window.editarItem = function (endpoint, id) {
        fetch(`http://localhost:8080/${endpoint}/${id}`)
            .then(response => response.json())
            .then(dados => {
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

    // Carrega os dados de entradas e despesas e, ao final, atualiza os cards
    Promise.all([
        carregarDados("entradas", "Entrada"),
        carregarDados("saidas", "Saída")
    ]).then(() => {
        atualizarCards(dadosEntradas, dadosSaidas);
    });
});
