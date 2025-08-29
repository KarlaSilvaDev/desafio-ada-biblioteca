import { gerarId } from "../utils/gerarId.js";
import { TIPO_ENTIDADE } from "./enum/TipoEntidade.js";

export class Livro {
    #id;
    #titulo;
    #autorId;
    #autorObj;
    #ano;
    #genero;
    #editora;
    #totalExemplares;
    #totalDisponivel;

    constructor(titulo, autor, ano, genero, editora, totalExemplares, id = gerarId(TIPO_ENTIDADE.LIVRO), totalDisponivel = totalExemplares) {
        this.#id = id;
        this.#titulo = titulo;
        this.#autorId = autor;
        this.#autorObj = null;
        this.#ano = ano;
        this.#genero = genero;
        this.#editora = editora;
        this.#totalExemplares = totalExemplares;
        this.#totalDisponivel = totalDisponivel ?? totalExemplares;
    }

    get id() {
        return this.#id;
    }
    get titulo() {
        return this.#titulo;
    }
    get autor() {
        return this.#autorId;
    }
    get ano() {
        return this.#ano;
    }

    get genero() {
        return this.#genero;
    }

    get editora() {
        return this.#editora;
    }

    get totalExemplares() {
        return this.#totalExemplares;
    }

    get totalDisponivel() {
        return this.#totalDisponivel;
    }

    get autorObj() {
        return this.#autorObj;
    }

    set titulo(v) {
        this.#titulo = v;
    }

    set ano(v) {
        this.#ano = v;
    }

    set genero(v) {
        this.#genero = v;
    }

    set editora(v) {
        this.#editora = v;
    }

    set totalExemplares(v) {
        this.#totalExemplares = v;
    }

    set totalDisponivel(v) {
        this.#totalDisponivel = v;
    }

    setAutor(autorInstance) {
        this.#autorObj = autorInstance;
        this.#autorId = autorInstance?.id ?? this.#autorId;
    }

    toJSON() {
        return {
            id: this.#id, titulo: this.#titulo,
            autor: this.#autorId,
            ano: this.#ano, genero: this.#genero, editora: this.#editora,
            totalExemplares: this.#totalExemplares, totalDisponivel: this.#totalDisponivel
        };
    }

    static fromJSON(d) {
        return new Livro(d.titulo, d.autor, d.ano, d.genero, d.editora, d.totalExemplares, d.id, d.totalDisponivel);
    }
}
