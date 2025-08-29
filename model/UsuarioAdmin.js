import { Usuario } from "./Usuario.js";
import { TIPO_ENTIDADE } from "./enum/TipoEntidade.js";

export class UsuarioAdmin extends Usuario {

    constructor(nome, matricula, perfil = "ADMIN", id) {
        super(nome, matricula, "ADMIN", TIPO_ENTIDADE.ADMINISTRADOR, id);
    }

    limiteEmprestimo() {
        return 0;
    }

    podeSolicitarEmprestimo() {
        return false;
    }

    static fromJSON(d) {
        return new UsuarioAdmin(d.nome, d.matricula, "ADMIN", d.id);
    }
}
