# 📚 Biblioteca Ada

Projeto de gerenciamento de biblioteca desenvolvido no Módulo de Orientação a Objetos do curso de Front-end da **Ada Tech**.  
A aplicação permite realizar operações de **CRUD** para livros, autores, usuários e empréstimos, além de manter um histórico de interações. 
A persistência dos dados é feita usando LocalStorage, visto que o objetivo desse desafio é apenas consolidar os conhecimentos em Javascript e POO.

---

## 🚀 Tecnologias utilizadas

- **JavaScript (ES6+)**
- **TailwindCSS** (para layout e estilos)
- **LocalStorage** (para persistência simples no navegador)
- **HTML5**

---

## 🏗️ Estrutura do Projeto


- **`/model`** → Contém as entidades principais do domínio, apresentadas no diagrama UML:
  - `Autor`
  - `Livro`
  - `Usuario`, `UsuarioAluno`, `UsuarioProfessor`, `UsuarioAdmin`
  - `Emprestimo`
  - `enum/GENERO`, `enum/TIPO_ENTIDADE`

- **`/services`**
  - `BibliotecaService` → camada responsável pela lógica de negócio e operações de persistência.

- **`/utils`**
  - `gerarId.js` → Geração de identificadores únicos.

- **Arquivos de UI (HTML/JS)** → Interface CRUD com páginas para Livros, Autores, Usuários e Empréstimos.

---

## 📖 Funcionalidades

- **Livros**
  - Cadastrar, editar e remover livros
  - Controle de exemplares disponíveis e emprestados
  - Associação com autores

- **Autores**
  - Cadastrar, editar e remover autores
  - Associação com livros

- **Usuários**
  - Suporte a **Alunos**, **Professores** e **Administradores**
  - Regras de limite de empréstimos:
    - Alunos: até 2
    - Professores: até 3
    - Administradores: não realizam empréstimos

- **Empréstimos**
  - Registrar novo empréstimo
  - Devolver livros
  - Histórico vinculado ao usuário

---

## 🗂️ Modelo Orientado a Objetos

Abaixo está um diagrama simplificado do modelo. Para mais detalhes, [clique aqui](https://github.com/KarlaSilvaDev/desafio-ada-biblioteca/blob/main/Biblioteca%20-%20Diagrama%20UML.png)

```mermaid
classDiagram
Usuario <|-- UsuarioAluno
Usuario <|-- UsuarioProfessor
Usuario <|-- UsuarioAdmin
Livro "n" --> "1" Autor
Usuario "1" --> "0..*" Emprestimo
Emprestimo "1" --> "1" Livro
Emprestimo "1" --> "1" Usuario
BibliotecaService o-- "*" Livro
BibliotecaService o-- "*" Autor
BibliotecaService o-- "*" Usuario
BibliotecaService o-- "*" Emprestimo


