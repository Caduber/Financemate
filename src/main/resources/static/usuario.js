document.addEventListener("DOMContentLoaded", function () {
    const formulario = document.getElementById("userForm");
    const tabelaBody = document.querySelector("#userTable tbody");
    let editingId = null;

    // Função para carregar e exibir os usuários na tabela
    function carregarUsuarios() {
        fetch("http://localhost:8080/usuarios")
            .then(response => response.json())
            .then(usuarios => {
                tabelaBody.innerHTML = ""; // Limpa a tabela antes de carregar os dados

                usuarios.forEach(usuario => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${usuario.id}</td>
                        <td>${usuario.nome}</td>
                        <td>${usuario.email}</td>
                        <td>${usuario.senha}</td>
                        <td>
                            <button onclick="editarUsuario(${usuario.id})">✏️</button>
                            <button onclick="excluirUsuario(${usuario.id})">🗑️</button>
                        </td>
                    `;
                    tabelaBody.appendChild(row);
                });
            })
            .catch(error => console.error("Erro ao carregar usuários:", error));
    }

    // Função para criar ou atualizar um usuário
    formulario.addEventListener("submit", function (e) {
        e.preventDefault();

        const dados = {
            nome: document.getElementById("name").value,
            email: document.getElementById("email").value,
            senha: document.getElementById("password").value,
        };

        const metodo = editingId ? "PUT" : "POST";
        const url = editingId ? `http://localhost:8080/usuarios/${editingId}` : "http://localhost:8080/usuarios";

        fetch(url, {
            method: metodo,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados),
        })
            .then(response => {
                if (!response.ok) throw new Error(`Erro ao ${editingId ? "atualizar" : "criar"} usuário`);
                return response.json();
            })
            .then(data => {
                alert(`Usuário ${editingId ? "atualizado" : "criado"} com sucesso!`);
                limparFormulario();
                carregarUsuarios(); // Recarrega a tabela após a operação
            })
            .catch(error => console.error("Erro:", error));
    });

    // Função para editar um usuário
    window.editarUsuario = function (id) {
        fetch(`http://localhost:8080/usuarios/${id}`)
            .then(response => response.json())
            .then(usuario => {
                document.getElementById("name").value = usuario.nome;
                document.getElementById("email").value = usuario.email;
                document.getElementById("password").value = usuario.senha;
                editingId = usuario.id; // Define o ID do usuário que está sendo editado
            })
            .catch(error => console.error("Erro ao buscar usuário:", error));
    };

    // Função para excluir um usuário
    window.excluirUsuario = function (id) {
        if (confirm("Tem certeza que deseja excluir este usuário?")) {
            fetch(`http://localhost:8080/usuarios/${id}`, { method: "DELETE" })
                .then(response => {
                    if (!response.ok) throw new Error("Erro ao excluir usuário");
                    alert("Usuário excluído com sucesso!");
                    carregarUsuarios(); // Recarrega a tabela após a exclusão
                })
                .catch(error => console.error("Erro:", error));
        }
    };

    // Função para limpar o formulário
    function limparFormulario() {
        document.getElementById("name").value = "";
        document.getElementById("email").value = "";
        document.getElementById("password").value = "";
        editingId = null; // Reseta o ID de edição
    }

    // Carrega os usuários ao iniciar a página
    carregarUsuarios();
});