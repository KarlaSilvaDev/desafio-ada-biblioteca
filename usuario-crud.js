import { BibliotecaService } from './service/BibliotecaService.js';

const bibliotecaService = new BibliotecaService();

const usuariosTable = document.getElementById("usuariosTable");
const form = document.getElementById("adicionarUsuarioForm");
const btnNovo = document.getElementById("adicionarUsuarioBtn");
const btnSalvar = document.getElementById("salvarUsuarioBtn");

const nomeInput = document.getElementById("nomeUsuario");
const matriculaInput = document.getElementById("matricula");
const perfilSelect = document.getElementById("perfilUsuario");
const grupoCurso = document.getElementById("grupoCurso");
const grupoDepartamento = document.getElementById("grupoDepartamento");
const cursoInput = document.getElementById("cursoUsuario");
const departamentoInput = document.getElementById("departamentoUsuario");

let usuarioEditando = null;

perfilSelect?.addEventListener("change", () => {
    const perfil = perfilSelect.value;
    if (perfil === "ALUNO") {
        grupoCurso.classList.remove("hidden");
        grupoDepartamento.classList.add("hidden");
        departamentoInput.value = "";
    } else if (perfil === "PROFESSOR") {
        grupoDepartamento.classList.remove("hidden");
        grupoCurso.classList.add("hidden");
        cursoInput.value = "";
    } else {
        grupoCurso.classList.add("hidden");
        grupoDepartamento.classList.add("hidden");
        cursoInput.value = "";
        departamentoInput.value = "";
    }
});

function renderizarTabelaUsuarios() {
    usuariosTable.innerHTML = "";
    const usuarios = bibliotecaService.listarUsuarios();

    usuarios.forEach(usuario => {
        const extra = usuario.perfil === "ALUNO" ? (usuario.curso ?? "—") : (usuario.perfil === "PROFESSOR" ? (usuario.departamento ?? "—") : "—");
        const tr = document.createElement("tr");
        tr.innerHTML = `
      <td class="px-4 py-2">${usuario.id}</td>
      <td class="px-4 py-2">${usuario.nome}</td>
      <td class="px-4 py-2">${usuario.matricula}</td>
      <td class="px-4 py-2">${usuario.perfil}</td>
      <td class="px-4 py-2">${extra}</td>
      <td class="px-4 py-2">
        <button class="text-blue-600 hover:underline mr-2" data-edit="${usuario.id}">Editar</button>
        <button class="text-red-600 hover:underline" data-del="${usuario.id}">Excluir</button>
      </td>
    `;
        usuariosTable.appendChild(tr);
    });

    usuariosTable.querySelectorAll("[data-edit]").forEach(b => b.addEventListener("click", () => editarUsuario(b.dataset.edit)));
    usuariosTable.querySelectorAll("[data-del]").forEach(b => b.addEventListener("click", () => { bibliotecaService.removerUsuario(b.dataset.del); renderizarTabelaUsuarios(); }));
}

function editarUsuario(id) {
    const usuario = bibliotecaService.listarUsuarios().find(usuario => usuario.id === id);
    if (!usuario) return;
    usuarioEditando = id;
    nomeInput.value = usuario.nome;
    matriculaInput.value = usuario.matricula;
    perfilSelect.value = usuario.perfil;
    perfilSelect.dispatchEvent(new Event('change'));
    if (usuario.perfil === "ALUNO") cursoInput.value = usuario.curso ?? "";
    if (usuario.perfil === "PROFESSOR") departamentoInput.value = usuario.departamento ?? "";
    form.classList.remove("hidden");
}

function salvarUsuario(e) {
    e.preventDefault();

    const perfil = perfilSelect.value;
    const payload = {
        nome: nomeInput.value.trim(),
        matricula: matriculaInput.value.trim(),
        perfil
    };

    if (perfil === "ALUNO") payload.curso = cursoInput.value.trim();
    if (perfil === "PROFESSOR") payload.departamento = departamentoInput.value.trim();

    if (usuarioEditando) {
        bibliotecaService.editarUsuario(usuarioEditando, payload);
    } else {
        bibliotecaService.adicionarUsuario(payload);
    }

    usuarioEditando = null;
    form.reset();
    perfilSelect.dispatchEvent(new Event('change'));
    form.classList.add("hidden");
    renderizarTabelaUsuarios();
}

btnNovo?.addEventListener("click", () => {
    form.classList.toggle("hidden");
    usuarioEditando = null;
    form.reset();
    perfilSelect.value = "";
    perfilSelect.dispatchEvent(new Event('change'));
});

btnSalvar?.addEventListener("click", salvarUsuario);

renderizarTabelaUsuarios();
