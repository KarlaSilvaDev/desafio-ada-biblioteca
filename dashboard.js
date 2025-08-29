const K = {
    LIVROS: "livros",
    USUARIOS: "usuarios",
    EMPRESTIMOS: "emprestimos"
};

const get = (k) => {
    try { return JSON.parse(localStorage.getItem(k) || "[]"); }
    catch { return []; }
};

function calcTotais() {
    const livros = get(K.LIVROS);
    const usuarios = get(K.USUARIOS);
    const emprestimos = get(K.EMPRESTIMOS);

    const ativos = emprestimos.filter(emprestimo => !emprestimo.devolvido).length;

    let disp = 0, total = 0;
    for (const l of livros) {
        const t = Number(l?.totalExemplares ?? l?.exemplaresTotal ?? 0);
        const d = Number(l?.exemplaresDisponiveis ?? l?.exemplaresDisp ?? 0);
        total += t;
        disp += d;
    }
    const emprest = Math.max(total - disp, 0);

    return { livros, usuarios, emprestimos, ativos, disp, emprest };
}

function preencherCards() {
    const { livros, usuarios, ativos } = calcTotais();
    const elLivros = document.getElementById("total-livros");
    const elEmp = document.getElementById("total-emprestimos-ativos");
    const elUsers = document.getElementById("total-usuarios");

    if (!elLivros) return;
    elLivros.textContent = String(livros.length);
    elEmp.textContent = String(ativos);
    elUsers.textContent = String(usuarios.length);
}

function preencherUltimos() {
    const { emprestimos } = calcTotais();
    const ul = document.getElementById("lista-emprestimos");
    if (!ul) return;

    ul.innerHTML = "";

    const ord = [...emprestimos].sort((a, b) => {
        const da = new Date(a?.dataEmprestimo || a?.data || 0).getTime();
        const db = new Date(b?.dataEmprestimo || b?.data || 0).getTime();
        return db - da;
    }).slice(0, 5);

    const livros = get(K.LIVROS);
    const usuarios = get(K.USUARIOS);

    for (const e of ord) {
        const livro = livros.find(l => l.id === e.livroId);
        const usuario = usuarios.find(u => u.id === e.usuarioId);
        const li = document.createElement("li");
        li.className = "flex justify-between text-slate-700";
        li.innerHTML = `
        <span>${escapeHtml(livro?.titulo ?? "—")}</span>
        <span class="text-sm">${escapeHtml(usuario?.nome ?? "—")}</span>
      `;
        ul.appendChild(li);
    }
}

function desenharGrafico() {
    const { disp, emprest } = calcTotais();
    const canvas = document.getElementById("graficoLivros");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const corDisp = "#22c55e";
    const corEmp = "#3b82f6";
    const corEixo = "#94a3b8";
    const corTexto = "#0f172a";

    const labels = ["Disponíveis", "Emprestados"];
    const dados = [disp, emprest];
    const max = Math.max(1, ...dados);
    const padding = 40;
    const baseY = H - padding;
    const areaAltura = H - padding * 2;
    const colW = (W - padding * 2) / (labels.length * 2);
    const x0 = padding + colW * 0.5;


    ctx.strokeStyle = corEixo;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, baseY);
    ctx.lineTo(W - padding, baseY);
    ctx.stroke();

    labels.forEach((label, i) => {
        const valor = dados[i];
        const altura = Math.round((valor / max) * (areaAltura));
        const x = x0 + i * colW * 2;
        const y = baseY - altura;

        ctx.fillStyle = i === 0 ? corDisp : corEmp;
        ctx.fillRect(x, y, colW, altura);

        ctx.fillStyle = corTexto;
        ctx.font = "bold 14px system-ui, -apple-system, Segoe UI, Roboto";
        ctx.textAlign = "center";
        ctx.fillText(String(valor), x + colW / 2, y - 6);

        ctx.fillStyle = "#334155"; // slate-700
        ctx.font = "12px system-ui, -apple-system, Segoe UI, Roboto";
        ctx.fillText(label, x + colW / 2, baseY + 16);
    });
}

function escapeHtml(s) { return String(s ?? "").replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m])); }

export function renderDashboard() {
    preencherCards();
    preencherUltimos();
    desenharGrafico();
}


document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('.menu-item[data-tab]').forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.dataset.tab === 'dashboard') {
                setTimeout(renderDashboard, 0);
            }
        });
    });

    const dash = document.getElementById("dashboard");
    if (dash && !dash.classList.contains("hidden")) renderDashboard();
});
