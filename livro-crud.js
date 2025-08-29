import { BibliotecaService } from './service/BibliotecaService.js';
import { atualizarSelectAutores } from './autor-crud.js';
import { GENERO } from './model/enum/Generos.js';

const bibliotecaService = new BibliotecaService();

const livrosTable = document.getElementById("livrosTable");
const adicionarLivroForm = document.getElementById("adicionarLivroForm");
const adicionarLivroBtn = document.getElementById("adicionarLivroBtn");
const salvarLivroBtn = document.getElementById("salvarLivroBtn");

const tituloInput = document.getElementById("titulo");
const autorInput = document.getElementById("autor");
const anoInput = document.getElementById("ano");
const generoInput = document.getElementById("genero");
const editoraInput = document.getElementById("editora");
const exemplaresInput = document.getElementById("exemplares");

let livroEditando = null;

function popularGeneros() {
    if (!generoInput) return;
    if (generoInput.options.length > 1) return;
    Object.values(GENERO || {}).forEach(genero => {
        const opcao = document.createElement('option');
        opcao.value = genero;
        opcao.textContent = genero;
        generoInput.appendChild(opcao);
    });
}

function renderizarTabelaLivros() {
    livrosTable.innerHTML = "";
    const livros = bibliotecaService.listarLivros();
    const autores = bibliotecaService.listarAutores();

    livros.forEach(livro => {
        const autor = autores.find(autor => autor.id === livro.autor);
        const tr = document.createElement("tr");
        tr.innerHTML = `
      <td class="px-4 py-2">${livro.id}</td>
      <td class="px-4 py-2">${livro.titulo}</td>
      <td class="px-4 py-2">${autor ? autor.nome : "—"}</td>
      <td class="px-4 py-2">${livro.ano}</td>
      <td class="px-4 py-2">${livro.genero}</td>
      <td class="px-4 py-2">${livro.editora}</td>
      <td class="px-4 py-2">${livro.totalDisponivel ?? livro.totalExemplares}</td>
      <td class="px-4 py-2">
        <button class="text-blue-600 hover:underline mr-2" data-edit="${livro.id}">Editar</button>
        <button class="text-red-600 hover:underline" data-del="${livro.id}">Excluir</button>
      </td>
    `;
        livrosTable.appendChild(tr);
    });

    livrosTable.querySelectorAll("[data-edit]").forEach(b => {
        b.addEventListener("click", () => editarLivro(b.dataset.edit));
    });
    livrosTable.querySelectorAll("[data-del]").forEach(b => {
        b.addEventListener("click", () => { bibliotecaService.removerLivro(b.dataset.del); renderizarTabelaLivros(); });
    });
}

function editarLivro(id) {
    const livro = bibliotecaService.listarLivros().find(livro => livro.id === id);
    if (!livro) return;
    livroEditando = id;
    tituloInput.value = livro.titulo;
    autorInput.value = livro.autor;
    anoInput.value = livro.ano;
    generoInput.value = livro.genero;
    editoraInput.value = livro.editora;
    exemplaresInput.value = livro.totalExemplares;
    adicionarLivroForm.classList.remove("hidden");
}

function salvarLivro(e) {
    e.preventDefault();

    const autorSelecionado = autorInput.value;
    if (!autorSelecionado) {
        alert("Selecione um autor válido.");
        return;
    }

    const payload = {
        titulo: (tituloInput.value || "").trim(),
        autor: autorSelecionado,
        ano: anoInput.value,
        genero: generoInput.value,
        editora: (editoraInput.value || "").trim(),
        totalExemplares: parseInt(exemplaresInput.value, 10)
    };

    if (livroEditando) {
        bibliotecaService.editarLivro(livroEditando, payload);
    } else {
        bibliotecaService.adicionarLivro(payload);
    }

    livroEditando = null;
    adicionarLivroForm.reset();
    adicionarLivroForm.classList.add("hidden");
    renderizarTabelaLivros();
}

adicionarLivroBtn?.addEventListener("click", () => {
    adicionarLivroForm.classList.toggle("hidden");
    livroEditando = null;
    adicionarLivroForm.reset();
});

salvarLivroBtn?.addEventListener("click", salvarLivro);

popularGeneros();
atualizarSelectAutores();
renderizarTabelaLivros();

window.addEventListener('autores:alterados', () => {
    atualizarSelectAutores();
    renderizarTabelaLivros();
});

document.querySelector('.menu-item[data-tab="livros"]')?.addEventListener('click', () => {
    atualizarSelectAutores();
    renderizarTabelaLivros();
});
