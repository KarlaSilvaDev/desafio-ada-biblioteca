import { Usuario } from "./Usuario.js";
import { TIPO_ENTIDADE } from "./enum/TipoEntidade.js";

export class UsuarioProfessor extends Usuario {
    #departamento;

    constructor(nome, matricula, perfil = "PROFESSOR", departamento, id) {
        super(nome, matricula, "PROFESSOR", TIPO_ENTIDADE.PROFESSOR, id);
        this.#departamento = departamento;
    }

    get departamento() {
        return this.#departamento;
    }

    set departamento(v) {
        this.#departamento = v;
    }

    limiteEmprestimo() {
        return 3;
    }

    toJSON() {
        const j = super.toJSON(); j.departamento = this.#departamento; return j;
    }
    static fromJSON(d) { return new UsuarioProfessor(d.nome, d.matricula, "PROFESSOR", d.departamento, d.id); }
}
