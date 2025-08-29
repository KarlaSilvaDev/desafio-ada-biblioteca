import { BibliotecaService } from './service/BibliotecaService.js'

const bibliotecaService = new BibliotecaService();

const modalAutor = document.getElementById("modalAutor");
const formAutor = document.getElementById("formAutor");
const cancelarAutorBtn = document.getElementById("cancelarAutorBtn");
const novoAutorBtn = document.getElementById("novoAutorBtn");
const selectAutorLivro = document.getElementById("autor");

function abrirModalAutor() { modalAutor?.classList.remove("hidden"); }
function fecharModalAutor() { modalAutor?.classList.add("hidden"); formAutor?.reset(); }

export function atualizarSelectAutores() {
    if (!selectAutorLivro) return;
    const autores = bibliotecaService.listarAutores();
    selectAutorLivro.innerHTML = `<option value="" disabled selected>Selecione um Autor</option>`;
    autores.forEach(autor => {
        const opcao = document.createElement('option');
        opcao.value = autor.id;
        opcao.textContent = autor.nome;
        selectAutorLivro.appendChild(opcao);
    });
}

novoAutorBtn?.addEventListener("click", abrirModalAutor);
cancelarAutorBtn?.addEventListener("click", fecharModalAutor);

formAutor?.addEventListener("submit", (e) => {
    e.preventDefault();
    const nome = (document.getElementById("nomeAutor").value || "").trim();
    const nacionalidade = (document.getElementById("nacionalidadeAutor").value || "").trim();
    const anoNascimento = (document.getElementById("anoNascimentoAutor").value || "").trim();
    if (!nome) return;

    const lista = bibliotecaService.listarAutores();
    const existente = lista.find(autor => autor.nome.toLowerCase() === nome.toLowerCase());
    let autorId;

    if (existente) {
        autorId = existente.id;
    } else {
        const novo = bibliotecaService.adicionarAutor({ nome, nacionalidade, anoNascimento });
        autorId = novo.id;
    }

    atualizarSelectAutores();
    window.dispatchEvent(new CustomEvent('autores:alterados'));
    if (selectAutorLivro) selectAutorLivro.value = autorId;

    fecharModalAutor();
});

const autoresTable = document.getElementById("autoresTable");
const formAutorCrud = document.getElementById("adicionarAutorForm");
const btnNovoAutor = document.getElementById("adicionarAutorBtn");
const btnSalvarAutor = document.getElementById("salvarAutorCrudBtn");

const nomeAutorCrud = document.getElementById("nomeAutorCrud");
const nacionalidadeAutorCrud = document.getElementById("nacionalidadeAutorCrud");
const anoNascimentoAutorCrud = document.getElementById("anoNascimentoAutorCrud");

let autorEditando = null;

function renderizarTabelaAutores() {
    if (!autoresTable) return;
    autoresTable.innerHTML = "";
    const autores = bibliotecaService.listarAutores();

    autores.forEach(autor => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
      <td class="px-4 py-2">${autor.id}</td>
      <td class="px-4 py-2">${autor.nome}</td>
      <td class="px-4 py-2">${autor.nacionalidade ?? "—"}</td>
      <td class="px-4 py-2">${autor.anoNascimento ?? "—"}</td>
      <td class="px-4 py-2">
        <button class="text-blue-600 hover:underline mr-2" data-edit="${autor.id}">Editar</button>
        <button class="text-red-600 hover:underline" data-del="${autor.id}">Excluir</button>
      </td>
    `;
        autoresTable.appendChild(tr);
    });

    autoresTable.querySelectorAll("[data-edit]").forEach(b => b.addEventListener("click", () => editarAutor(b.dataset.edit)));
    autoresTable.querySelectorAll("[data-del]").forEach(b => b.addEventListener("click", () => {
        bibliotecaService.removerAutor(b.dataset.del);
        renderizarTabelaAutores();
        atualizarSelectAutores();
        window.dispatchEvent(new CustomEvent('autores:alterados'));
    }));
}

function editarAutor(id) {
    const autor = bibliotecaService.listarAutores().find(autor => autor.id === id);
    if (!autor) return;
    autorEditando = id;
    nomeAutorCrud.value = autor.nome;
    nacionalidadeAutorCrud.value = autor.nacionalidade ?? "";
    anoNascimentoAutorCrud.value = autor.anoNascimento ?? "";
    formAutorCrud?.classList.remove("hidden");
}

function salvarAutorCrud(e) {
    e.preventDefault();
    const payload = {
        nome: (nomeAutorCrud.value || "").trim(),
        nacionalidade: (nacionalidadeAutorCrud.value || "").trim(),
        anoNascimento: (anoNascimentoAutorCrud.value || "").trim()
    };

    if (!payload.nome) return;

    if (autorEditando) {
        bibliotecaService.editarAutor(autorEditando, payload);
    } else {
        bibliotecaService.adicionarAutor(payload);
    }

    autorEditando = null;
    formAutorCrud.reset();
    formAutorCrud.classList.add("hidden");
    renderizarTabelaAutores();
    atualizarSelectAutores();
    window.dispatchEvent(new CustomEvent('autores:alterados'));
}

btnNovoAutor?.addEventListener("click", () => {
    formAutorCrud.classList.toggle("hidden");
    autorEditando = null;
    formAutorCrud.reset();
});

document.querySelector('.menu-item[data-tab="autores"]')?.addEventListener('click', () => {
    renderizarTabelaAutores();
});

btnSalvarAutor?.addEventListener("click", salvarAutorCrud);

renderizarTabelaAutores();
atualizarSelectAutores();
