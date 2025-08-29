import { gerarId } from "../utils/gerarId.js";
import { TIPO_ENTIDADE } from "./enum/TipoEntidade.js";

export class Emprestimo {
    #id;
    #livroObj;
    #usuarioObj;
    #livroId;
    #usuarioId;
    #dataEmprestimo;
    #dataPrevistaDevolucao;
    #dataDevolucao;
    #devolvido;

    constructor(livroObj, usuarioObj, id = gerarId(TIPO_ENTIDADE.EMPRESTIMO)) {
        this.#id = id;
        this.#livroObj = livroObj ?? null;
        this.#usuarioObj = usuarioObj ?? null;
        this.#livroId = livroObj?.id ?? null;
        this.#usuarioId = usuarioObj?.id ?? null;

        this.#dataEmprestimo = new Date();
        this.#dataPrevistaDevolucao = new Date(this.#dataEmprestimo.getTime());
        this.#dataPrevistaDevolucao.setDate(this.#dataPrevistaDevolucao.getDate() + 7);

        this.#dataDevolucao = null;
        this.#devolvido = false;
    }

    get id() {
        return this.#id;
    }

    get livro() {
        return this.#livroObj?.id ?? this.#livroId;
    }

    get usuario() {
        return this.#usuarioObj?.id ?? this.#usuarioId;
    }

    get livroObj() {
        return this.#livroObj;
    }

    get usuarioObj() {
        return this.#usuarioObj;
    }

    setLivro(livro) {
        this.#livroObj = livro; this.#livroId = livro?.id ?? this.#livroId;
    }

    setUsuario(usuario) {
        this.#usuarioObj = usuario; this.#usuarioId = usuario?.id ?? this.#usuarioId;
    }

    get dataEmprestimo() {
        return this.#dataEmprestimo;
    }

    get dataPrevistaDevolucao() {
        return this.#dataPrevistaDevolucao;
    }

    get dataDevolucao() {
        return this.#dataDevolucao;
    }

    get devolvido() {
        return this.#devolvido;
    }

    devolver() {
        if (this.#devolvido) return;
        this.#dataDevolucao = new Date();
        this.#devolvido = true;
    }

    toJSON() {
        return {
            id: this.#id,
            livro: this.livro,
            usuario: this.usuario,
            dataEmprestimo: this.#dataEmprestimo,
            dataPrevistaDevolucao: this.#dataPrevistaDevolucao,
            dataDevolucao: this.#dataDevolucao,
            devolvido: this.#devolvido
        };
    }

    static fromJSON(d) {
        const e = new Emprestimo(null, null, d.id);
        e.#livroId = d.livro ?? null;
        e.#usuarioId = d.usuario ?? null;
        e.#dataEmprestimo = new Date(d.dataEmprestimo);
        e.#dataPrevistaDevolucao = new Date(d.dataPrevistaDevolucao);
        e.#dataDevolucao = d.dataDevolucao ? new Date(d.dataDevolucao) : null;
        e.#devolvido = !!d.devolvido;
        return e;
    }
}
