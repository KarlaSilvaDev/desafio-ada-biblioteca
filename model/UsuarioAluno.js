import { Usuario } from "./Usuario.js";
import { TIPO_ENTIDADE } from "./enum/TipoEntidade.js";

export class UsuarioAluno extends Usuario {
    #curso;

    constructor(nome, matricula, perfil = "ALUNO", curso, id) {
        super(nome, matricula, "ALUNO", TIPO_ENTIDADE.ALUNO, id);
        this.#curso = curso;
    }

    get curso() {
        return this.#curso;
    }

    set curso(v) { this.#curso = v; }
    toJSON() {
        const j = super.toJSON(); j.curso = this.#curso; return j;
    }

    static fromJSON(d) {
        const u = new UsuarioAluno(d.nome, d.matricula, "ALUNO", d.curso, d.id); return u;
    }
}
