import { gerarId } from "../utils/gerarId.js";

export class Usuario {
    #id; 
    #nome; 
    #matricula; 
    #perfil; 
    #historicoEmprestimos;
    
    constructor(nome, matricula, perfil, tipoEntidade, id = gerarId(tipoEntidade)) {
        this.#id = id; 
        this.#nome = nome; 
        this.#matricula = matricula; 
        this.#perfil = perfil;
        this.#historicoEmprestimos = [];
    }

    get id() {
        return this.#id;
    }

    get nome() {
        return this.#nome;
    }

    get matricula() {
        return this.#matricula;
    }

    get perfil() {
        return this.#perfil;
    }
    get historicoEmprestimos() {
        return this.#historicoEmprestimos;
    }

    set nome(v) {
        this.#nome = v;
    }

    set matricula(v) {
        this.#matricula = v;
    }

    adicionarEmprestimo(e) {
        if (!this.#historicoEmprestimos.includes(e)) this.#historicoEmprestimos.push(e);
    }

    setHistoricoEmprestimos(list) {
        this.#historicoEmprestimos = Array.isArray(list) ? list : [];
    }

    limiteEmprestimo() {
        return 2;
    }

    podeSolicitarEmprestimo(ativos) {
        return ativos < this.limiteEmprestimo();
    }

    toJSON() {
        return {
            id: this.#id, nome: this.#nome, matricula: this.#matricula, perfil: this.#perfil, historicoEmprestimos: this.#historicoEmprestimos.map(e => e.id)
        };
    }
}
