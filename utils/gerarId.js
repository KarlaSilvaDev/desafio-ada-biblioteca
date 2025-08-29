import { TIPO_ENTIDADE } from "../model/enum/TipoEntidade.js";

export function gerarId(tipoEntidade) {
    if (!Object.values(TIPO_ENTIDADE).includes(tipoEntidade)) {
        throw new Error("Tipo de entidade inválida");
    }

    const agora = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);

    const aleatorio = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${tipoEntidade}${agora}${aleatorio}`;
}