function salvarNoLocalStorage() {
    localStorage.setItem("livros", JSON.stringify(livros));
    localStorage.setItem("autores", JSON.stringify(autores));
}

function carregarDoLocalStorage() {
    const livrosSalvos = localStorage.getItem("livros");
    const autoresSalvos = localStorage.getItem("autores");

    if (livrosSalvos) {
        livros = JSON.parse(livrosSalvos);
    }

    if (autoresSalvos) {
        autores = JSON.parse(autoresSalvos);
    }
}

export { salvarNoLocalStorage, carregarDoLocalStorage };