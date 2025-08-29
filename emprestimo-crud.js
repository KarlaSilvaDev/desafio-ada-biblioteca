import { BibliotecaService } from './service/BibliotecaService.js';

const bibliotecaService = new BibliotecaService();

const emprestimosTable = document.getElementById("emprestimosTable");
const form = document.getElementById("adicionarEmprestimoForm");
const btnNovo = document.getElementById("adicionarEmprestimoBtn");
const btnSalvar = document.getElementById("salvarEmprestimoBtn");

const livroSelect = document.getElementById("livroEmprestimo");
const usuarioSelect = document.getElementById("usuarioEmprestimo");

function popularSelects() {

    const livros = bibliotecaService.listarLivros();
    livroSelect.innerHTML = `<option value="" disabled selected>Selecione um livro</option>`;
    livros.forEach(livro => {
        const disponivel = livro.totalDisponivel ?? livro.totalExemplares;
        if (disponivel > 0) {
            const opcao = document.createElement("option");
            opcao.value = livro.id;
            opcao.textContent = `${livro.titulo} (${disponivel} disp.)`;
            livroSelect.appendChild(opcao);
        }
    });

    const usuarios = bibliotecaService.listarUsuarios();
    usuarioSelect.innerHTML = `<option value="" disabled selected>Selecione um usuário</option>`;
    usuarios.forEach(usuario => {
        const extra = usuario.perfil === "ALUNO" ? (usuario.curso ?? "") :
            usuario.perfil === "PROFESSOR" ? (usuario.departamento ?? "") : "";
        const opcao = document.createElement("option");
        opcao.value = usuario.id;
        opcao.textContent = `${usuario.nome} - ${usuario.perfil}${extra ? " • " + extra : ""}`;
        usuarioSelect.appendChild(opcao);
    });
}

function renderizarTabelaEmprestimos() {
    emprestimosTable.innerHTML = "";
    const emprestimos = bibliotecaService.listarEmprestimos();
    const livros = bibliotecaService.listarLivros();
    const usuarios = bibliotecaService.listarUsuarios();

    emprestimos.forEach(emprestimo => {
        const livro = livros.find(livro => livro.id === (emprestimo.livro?.id || emprestimo.livro));
        const usuario = usuarios.find(usuario => usuario.id === (emprestimo.usuario?.id || emprestimo.usuario));
        const status = emprestimo.devolvido ? "Devolvido" : "Ativo";

        const tr = document.createElement("tr");
        tr.innerHTML = `
      <td class="px-4 py-2">${emprestimo.id}</td>
      <td class="px-4 py-2">${livro ? livro.titulo : "—"}</td>
      <td class="px-4 py-2">${usuario ? usuario.nome : "—"}</td>
      <td class="px-4 py-2">${formatarData(emprestimo.dataEmprestimo)}</td>
      <td class="px-4 py-2">${formatarData(emprestimo.dataPrevistaDevolucao)}</td>
      <td class="px-4 py-2">${emprestimo.dataDevolucao ? formatarData(emprestimo.dataDevolucao) : "—"}</td>
      <td class="px-4 py-2">${status}</td>
      <td class="px-4 py-2">
        ${emprestimo.devolvido
                ? `—`
                : `<button class="text-green-700 hover:underline mr-2" data-return="${emprestimo.id}">Devolver</button>`
            }
      </td>
    `;
        emprestimosTable.appendChild(tr);
    });

    emprestimosTable.querySelectorAll("[data-return]").forEach(b =>
        b.addEventListener("click", () => {
            bibliotecaService.devolver(b.dataset.return);
            renderizarTabelaEmprestimos();
        })
    );
}

function salvarEmprestimo(emprestimo) {
    emprestimo.preventDefault();
    const livroId = livroSelect.value;
    const usuarioId = usuarioSelect.value;
    if (!livroId || !usuarioId) return;

    bibliotecaService.emprestar(livroId, usuarioId);
    form.reset();
    form.classList.add("hidden");
    renderizarTabelaEmprestimos();
}

function formatarData(data) {
    if (!data) return "—";
    const dataFormatada = new Date(data);
    return dataFormatada.toLocaleDateString();
}

btnNovo?.addEventListener("click", () => {
    popularSelects();
    form.classList.toggle("hidden");
});

btnSalvar?.addEventListener("click", salvarEmprestimo);

document.querySelector('.menu-item[data-tab="emprestimos"]')?.addEventListener('click', () => {
    renderizarTabelaEmprestimos();
});

renderizarTabelaEmprestimos();
