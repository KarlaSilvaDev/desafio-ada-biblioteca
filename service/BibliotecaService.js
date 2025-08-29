import { Livro } from "../model/Livro.js";
import { Autor } from "../model/Autor.js";
import { UsuarioAluno } from "../model/UsuarioAluno.js";
import { UsuarioProfessor } from "../model/UsuarioProfessor.js";
import { UsuarioAdmin } from "../model/UsuarioAdmin.js";
import { Emprestimo } from "../model/Emprestimo.js";

export class BibliotecaService {
    static #instance = null;

    #livros = [];
    #autores = [];
    #usuarios = [];
    #emprestimos = [];

    constructor() {
        if (BibliotecaService.#instance) return BibliotecaService.#instance;
        this.carregarDadosDoLocalStorage();
        BibliotecaService.#instance = this;
    }

    adicionarAutor(autor) {
        if (!(autor instanceof Autor)) autor = Autor.fromJSON(autor);
        this.#autores.push(autor);
        this.salvarNoLocalStorage();
        return autor;
    }

    editarAutor(id, dados) {
        const i = this.#autores.findIndex(a => a.id === id);
        if (i === -1) return null;
        const atualizado = Autor.fromJSON({ ...this.#autores[i].toJSON(), ...dados, id });
        this.#autores[i] = atualizado;
        this.salvarNoLocalStorage();
        return atualizado;
    }

    removerAutor(id) {
        const autor = this.#autores.find(autor => autor.id == id);

        if (!autor) {
            alert("Autor não encontrado.");
            return;
        }

        const estaVinculadoLivro = this.#livros.some(livro => livro.autor === id);

        if (estaVinculadoLivro) {
            alert("Não é possível excluir o autor, pois ele está vinculado à um livro cadastrado no acervo.");
            return;
        }

        this.#autores = this.#autores.filter(a => a.id !== id);
        this.salvarNoLocalStorage();
    }

    listarAutores() {
        return this.#autores.map(a => a.toJSON());
    }

    adicionarLivro(livro) {
        if (!(livro instanceof Livro)) livro = Livro.fromJSON(livro);
        const autorObj = this.#autores.find(a => a.id === livro.autor);
        if (autorObj && livro.setAutor) livro.setAutor(autorObj);
        this.#livros.push(livro);
        this.salvarNoLocalStorage();
        return livro;
    }

    editarLivro(id, dados) {
        const indice = this.#livros.findIndex(livro => livro.id == id);

        if (indice === -1) {
            alert('Livro não encontrado');
            return null;
        };

        const livro = this.#livros.find(livro => livro.id === id);

        if (dados.totalExemplares > livro.totalExemplares) {
            dados.totalDisponivel = livro.totalDisponivel + (dados.totalExemplares - livro.totalExemplares);

        } else if ((livro.totalExemplares - dados.totalExemplares) <= livro.totalDisponivel) {
            dados.totalDisponivel = livro.totalDisponivel - (livro.totalExemplares - dados.totalExemplares);
        } else {
            alert(`Não é possível reduzir a quantidade de exemplares para o valor informado. Há apenas ${livro.totalDisponivel} livros disponíveis. Logo, apenas essa quantidade pode ser retirada do acervo.`)
            return;
        }

        const livroEditado = Livro.fromJSON({ ...livro.toJSON(), ...dados });

        const autorObj = this.#autores.find(autor => autor.id === livroEditado.autor);

        if (autorObj && livroEditado.setAutor) {
            livroEditado.setAutor(autorObj)
        };

        this.#livros[indice] = livroEditado;
        this.salvarNoLocalStorage();
        return livroEditado;
    }

    removerLivro(id) {
        const livro = this.#livros.find(livro => livro.id == id);

        if (!livro) {
            alert("Livro não encontrado!");
            return;
        }

        const haExemplarEmprestado = this.#emprestimos.some(emprestimo => emprestimo.livro == id && !emprestimo.devolvido);

        if (haExemplarEmprestado) {
            alert("O livro não pode ser excluído, pois há exemplar em empréstimo ativo. Aguarde a devolução.");
            return;
        }

        this.#livros = this.#livros.filter(l => l.id !== id);
        this.salvarNoLocalStorage();
    }

    listarLivros() {
        return this.#livros.map(l => l.toJSON());
    }

    adicionarUsuario(usuario) {
        let instanciaUsuario;
        if (usuario.perfil === "ALUNO") instanciaUsuario = UsuarioAluno.fromJSON(usuario);
        else if (usuario.perfil === "PROFESSOR") instanciaUsuario = UsuarioProfessor.fromJSON(usuario);
        else instanciaUsuario = UsuarioAdmin.fromJSON(usuario);
        this.#usuarios.push(instanciaUsuario);
        this.salvarNoLocalStorage();
        return instanciaUsuario;
    }

    editarUsuario(id, dados) {
        const indice = this.#usuarios.findIndex(usuario => usuario.id === id);

        if (indice === -1) return null;

        const merged = { ...this.#usuarios[indice].toJSON(), ...dados, id };
        let instanciaUsuario;

        if (merged.perfil === "ALUNO") {
            instanciaUsuario = UsuarioAluno.fromJSON(merged);
        }
        else if (merged.perfil === "PROFESSOR") {
            instanciaUsuario = UsuarioProfessor.fromJSON(merged);
        }
        else {
            instanciaUsuario = UsuarioAdmin.fromJSON(merged);
        }

        this.#usuarios[indice] = instanciaUsuario;
        this.salvarNoLocalStorage();
        return instanciaUsuario;
    }

    removerUsuario(id) {
        const usuario = this.#usuarios.find(usuario => usuario.id == id);

        if (!usuario) {
            alert("Usuário não encontrado");
            return;
        }

        const possuiEmprestimoAtivo = this.#emprestimos.some(emprestimo => emprestimo.usuario == id && !emprestimo.devolvido);

        if (possuiEmprestimoAtivo) {
            alert("O usuário não pode ser excluído, pois possui empréstimo ativo. Por favor, solicite a devolução do livro antes de prosseguir com a exclusão.");
            return;
        }

        this.#usuarios = this.#usuarios.filter(u => u.id !== id);
        this.salvarNoLocalStorage();
    }

    listarUsuarios() {
        return this.#usuarios.map(u => u.toJSON());
    }

    emprestar(livroId, usuarioId) {
        const livro = this.#livros.find(l => l.id === livroId);
        const usuario = this.#usuarios.find(u => u.id === usuarioId);

        if (!livro || !usuario) return null;

        const disp = (livro.totalDisponivel ?? livro.totalExemplares) | 0;
        if (disp <= 0) return null;

        const ativos = this.#emprestimos.filter(e => !e.devolvido && (e.usuario === usuarioId || e.usuarioObj?.id === usuarioId)).length;
        if (usuario.podeSolicitarEmprestimo && !usuario.podeSolicitarEmprestimo(ativos)) return null;

        const emp = new Emprestimo(livro, usuario);
        this.#emprestimos.push(emp);

        livro.totalDisponivel = disp - 1;

        if (usuario.adicionarEmprestimo) {
            usuario.adicionarEmprestimo(emp);
            console.log(usuario.historicoEmprestimos)
        }

        this.salvarNoLocalStorage();
        return emp;
    }

    devolver(emprestimoId) {
        const emp = this.#emprestimos.find(e => e.id === emprestimoId);
        if (!emp || emp.devolvido) return null;

        emp.devolver();

        const livroId = emp.livroObj?.id ?? emp.livro;
        const livro = this.#livros.find(l => l.id === livroId);
        if (livro) {
            const disp = (livro.totalDisponivel ?? 0) + 1;
            livro.totalDisponivel = Math.min(livro.totalExemplares, disp);
        }

        this.salvarNoLocalStorage();
        return emp;
    }

    removerEmprestimo(_id) {
        console.warn("Remover empréstimo não é permitido.");
        return null;
    }

    listarEmprestimos() {
        return this.#emprestimos.map(e => e.toJSON());
    }

    salvarNoLocalStorage() {
        localStorage.setItem("autores", JSON.stringify(this.#autores.map(a => a.toJSON())));
        localStorage.setItem("livros", JSON.stringify(this.#livros.map(l => l.toJSON())));
        localStorage.setItem("usuarios", JSON.stringify(this.#usuarios.map(u => u.toJSON())));
        localStorage.setItem("emprestimos", JSON.stringify(this.#emprestimos.map(e => e.toJSON())));
    }

    carregarDadosDoLocalStorage() {
        const autoresRaw = JSON.parse(localStorage.getItem("autores") || "[]");
        const livrosRaw = JSON.parse(localStorage.getItem("livros") || "[]");
        const usuariosRaw = JSON.parse(localStorage.getItem("usuarios") || "[]");
        const emprestimosRaw = JSON.parse(localStorage.getItem("emprestimos") || "[]");

        this.#autores = autoresRaw.map(Autor.fromJSON);
        this.#livros = livrosRaw.map(Livro.fromJSON);
        this.#usuarios = usuariosRaw.map(u => {
            if (u.perfil === "ALUNO") {
                return UsuarioAluno.fromJSON(u);
            }

            if (u.perfil === "PROFESSOR") {
                return UsuarioProfessor.fromJSON(u);
            }
            return UsuarioAdmin.fromJSON(u);
        });

        this.#emprestimos = emprestimosRaw.map(Emprestimo.fromJSON);
        this.#livros.forEach(livro => {
            const autor = this.#autores.find(autor => autor.id === autor.autor);
            if (autor && livro.setAutor) livro.setAutor(autor);
        });

        this.#emprestimos.forEach(emprestimo => {
            const livro = this.#livros.find(livro => livro.id === emprestimo.livro);
            const usuario = this.#usuarios.find(usuario => usuario.id === emprestimo.usuario);
            if (livro && emprestimo.setLivro) emprestimo.setLivro(livro);
            if (usuario && emprestimo.setUsuario) emprestimo.setUsuario(usuario);
        });

        this.#usuarios.forEach(usuario => {
            if (!usuario.setHistoricoEmprestimos) return;
            const ids = usuario.toJSON().historicoEmprestimos || [];
            const objs = ids.map(id => this.#emprestimos.find(emprestimo => emprestimo.id === id)).filter(Boolean);
            usuario.setHistoricoEmprestimos(objs);
        });
    }
}
