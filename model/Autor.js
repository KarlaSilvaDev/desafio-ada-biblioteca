import { gerarId } from "../utils/gerarId.js";
import { TIPO_ENTIDADE } from "./enum/TipoEntidade.js";

export class Autor {
    #id;
    #nome;
    #nacionalidade;
    #anoNascimento;

    constructor(nome, nacionalidade, anoNascimento, id = gerarId(TIPO_ENTIDADE.AUTOR)) {
        this.#id = id;
        this.#nome = nome;
        this.#nacionalidade = nacionalidade;
        this.#anoNascimento = anoNascimento;
    }
    get id() {
        return this.#id;
    }
    get nome() {
        return this.#nome;
    }

    get nacionalidade() {
        return this.#nacionalidade;
    }

    get anoNascimento() {
        return this.#anoNascimento;
    }

    set nome(v) {
        this.#nome = v;
    }

    set nacionalidade(v) {
        this.#nacionalidade = v;
    }

    set anoNascimento(v) {
        this.#anoNascimento = v;
    }

    toJSON() {
        return { id: this.#id, nome: this.#nome, nacionalidade: this.#nacionalidade, anoNascimento: this.#anoNascimento };
    }

    static fromJSON(d) {
        return new Autor(d.nome, d.nacionalidade, d.anoNascimento, d.id);
    }
}
