// =====================================
// SELEÇÃO DE ELEMENTOS DO DOM
// =====================================
const avatar = document.getElementById('avatar');
const welcomeTitle = document.getElementById('welcomeTitle');
const balanceValue = document.getElementById('balanceValue');
const totalIncome = document.getElementById('totalIncome');
const totalExpense = document.getElementById('totalExpense');
const incomeList = document.getElementById('incomeList');
const incomeSummary = document.getElementById('incomeSummary');
const expenseGroups = document.getElementById('expenseGroups');
const expenseSummary = document.getElementById('expenseSummary');
const reportContainer = document.getElementById('reportContainer');
const savedValue = document.getElementById('savedValue');
const sideSavedValue = document.getElementById('sideSavedValue');
const sideSavedBar = document.getElementById('sideSavedBar');
const sideSavedNote = document.getElementById('sideSavedNote');
const donut = document.getElementById('donut');
const donutTotal = document.getElementById('donutTotal');
const donutLegend = document.getElementById('donutLegend');
const recentList = document.getElementById('recentList');
const highlights = document.getElementById('highlights');
const headerMonth = document.getElementById('headerMonth');
const navBtns = document.querySelectorAll('.nav-btn');
const sections = document.querySelectorAll('.section');
const chart = document.getElementById('chart');
const messageContainer = document.getElementById('messageContainer');

const incomeModal = document.getElementById('incomeModal');
const incomeForm = document.getElementById('incomeForm');
const expenseModal = document.getElementById('expenseModal');
const expenseForm = document.getElementById('expenseForm');
const uniqueFields = document.getElementById('uniqueFields');
const fixedFields = document.getElementById('fixedFields');

const incomeName = document.getElementById('incomeName');
const incomeValue = document.getElementById('incomeValue');
const incomeDate = document.getElementById('incomeDate');
const expenseName = document.getElementById('expenseName');
const expenseValue = document.getElementById('expenseValue');
const expenseCategory = document.getElementById('expenseCategory');
const expenseDate = document.getElementById('expenseDate');
const expenseStart = document.getElementById('expenseStart');
const expenseEnd = document.getElementById('expenseEnd');

const saveIncomeBtn = document.getElementById('saveIncomeBtn');
const saveExpenseBtn = document.getElementById('saveExpenseBtn');

// =====================================
// ESTADO
// =====================================
const API_URL = 'http://localhost:8080';

// Usuário salvo pela tela de login em localStorage ('usuarioLogado')
let usuario = {};
try {
    usuario = JSON.parse(localStorage.getItem('usuarioLogado')) || {};
} catch (e) {
    usuario = {};
}

// Sem usuário logado, volta para a tela de login
if (!usuario.email) {
    window.location.href = 'telaLogin.html';
}

let receitas = [];
let despesas = [];

// =====================================
// FUNÇÕES UTILITÁRIAS
// =====================================
function formatMoney(value) {
    return Number(value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatDate(dateStr) {
    return dateStr ? new Date(dateStr + 'T00:00:00').toLocaleDateString('pt-BR') : '';
}

function showMessage(message, type = 'info') {
    const messageEl = document.createElement('div');
    messageEl.className = `message ${type}`;
    messageEl.textContent = message;

    messageContainer.innerHTML = '';
    messageContainer.appendChild(messageEl);

    setTimeout(() => messageEl.remove(), 4000);
}

function getTipoSelecionado() {
    return document.querySelector('input[name="tipo"]:checked').value;
}

// Despesa/receita entra no gráfico se cair no mês atual
function isInCurrentMonth(item) {
    const now = new Date();
    const inicioMes = new Date(now.getFullYear(), now.getMonth(), 1);
    const fimMes = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    if (item.tipo === 'FIXA') {
        const inicio = new Date(item.dataInicio + 'T00:00:00');
        const fim = new Date(item.dataFim + 'T23:59:59');
        return inicio <= fimMes && fim >= inicioMes;
    }

    const data = new Date(item.data + 'T00:00:00');
    return data >= inicioMes && data <= fimMes;
}

function sum(list) {
    return list.reduce((total, item) => total + item.valor, 0);
}

// =====================================
// MODAIS
// =====================================
function openModal(modal) {
    modal.style.display = 'flex';
}

function closeModals() {
    incomeModal.style.display = 'none';
    expenseModal.style.display = 'none';
    incomeForm.reset();
    expenseForm.reset();
    toggleTipoDespesa();
}

function toggleTipoDespesa() {
    const fixa = getTipoSelecionado() === 'FIXA';
    fixedFields.classList.toggle('hidden', !fixa);
    uniqueFields.classList.toggle('hidden', fixa);
    expenseDate.required = !fixa;
    expenseStart.required = fixa;
    expenseEnd.required = fixa;
}

// =====================================
// RENDERIZAÇÃO
// =====================================
function renderUser() {
    const nome = usuario.nome || usuario.name || '';
    welcomeTitle.textContent = nome
        ? `Olá ${nome}, seja bem vindo novamente`
        : 'Olá, seja bem vindo novamente';

    const foto = usuario.foto || usuario.fotoPerfil;
    if (foto) {
        const img = document.createElement('img');
        img.className = 'avatar';
        img.src = foto;
        img.alt = nome ? `Foto de ${nome}` : 'Foto de perfil';
        avatar.replaceWith(img);
    } else {
        avatar.textContent = (nome[0] || '?').toUpperCase();
    }
}

function createListItem(nome, meta, valor, cssClass) {
    const li = document.createElement('li');
    li.className = 'list-item';

    const left = document.createElement('div');
    const nameEl = document.createElement('div');
    nameEl.className = 'item-name';
    nameEl.textContent = nome;
    const metaEl = document.createElement('div');
    metaEl.className = 'item-meta';
    metaEl.textContent = meta;
    left.append(nameEl, metaEl);

    const valueEl = document.createElement('div');
    valueEl.className = `item-value ${cssClass}`;
    valueEl.textContent = formatMoney(valor);

    li.append(left, valueEl);
    return li;
}

function renderList(container, items, emptyText, buildItem) {
    container.innerHTML = '';

    if (items.length === 0) {
        const li = document.createElement('li');
        li.className = 'loading-text';
        li.textContent = emptyText;
        container.appendChild(li);
        return;
    }

    items.forEach(item => container.appendChild(buildItem(item)));
}

function chartRow(label, value, max, cssClass) {
    const percent = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
    return `
        <div class="chart-row">
            <div class="chart-row-head"><span>${label}</span><strong>${formatMoney(value)}</strong></div>
            <div class="bar-track"><div class="bar-fill ${cssClass}" style="width:${percent}%"></div></div>
        </div>
    `;
}

function renderChart() {
    const { totalRec: receitaMes, totalDes: gastoMes, totalFixas: fixasMes, economizado } = monthStats();
    const receitaLivre = receitaMes - fixasMes;
    const max = Math.max(receitaMes, gastoMes, 1);

    chart.innerHTML =
        chartRow('Receita livre', receitaLivre, max, 'bar-free') +
        chartRow('Gasto no mês', gastoMes, max, 'bar-spent') +
        chartRow('Economizado', economizado, max, 'bar-saved');
}

function render() {
    const totalReceitas = sum(receitas);
    const totalGastos = sum(despesas);
    const saldo = Number(usuario.saldo || usuario.balance || 0) + totalReceitas - totalGastos;

    totalIncome.textContent = formatMoney(totalReceitas);
    totalExpense.textContent = formatMoney(totalGastos);
    balanceValue.textContent = formatMoney(saldo);
    balanceValue.classList.toggle('negative', saldo < 0);

    renderList(incomeList, receitas, 'Nenhuma receita até o momento',
        r => createListItem(r.nome, formatDate(r.data), r.valor, 'positive'));

    incomeSummary.textContent = `Total recebido: ${formatMoney(totalReceitas)}`;
    expenseSummary.textContent = `Total gasto: ${formatMoney(totalGastos)}`;

    renderExpenseGroups();
    headerMonth.textContent = new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

    renderChart();
    renderReport();
    renderSavings();
    renderDonut();
    renderRecent();
    renderHighlights();
}

// =====================================
// CÁLCULOS DO MÊS
// =====================================
const CATEGORY_COLORS = ['#185FA5', '#1D9E75', '#BA7517', '#A32D2D', '#B5D4F4', '#0C447C', '#B4B2A9', '#854F0B'];

function monthStats() {
    const recMes = receitas.filter(isInCurrentMonth);
    const desMes = despesas.filter(isInCurrentMonth);
    const fixas = desMes.filter(d => d.tipo === 'FIXA');
    const unicas = desMes.filter(d => d.tipo !== 'FIXA');

    const totalRec = sum(recMes);
    const totalDes = sum(desMes);
    const economizado = totalRec - totalDes;
    const percent = totalRec > 0 ? Math.round((economizado / totalRec) * 100) : 0;

    return { recMes, desMes, fixas, unicas, totalRec, totalDes, totalFixas: sum(fixas), economizado, percent };
}

// =====================================
// VISÃO GERAL: KPI, BARRA LATERAL, ROSCA, RECENTES, DESTAQUES
// =====================================
function renderSavings() {
    const { economizado, percent, totalRec } = monthStats();

    savedValue.textContent = formatMoney(economizado);
    savedValue.classList.toggle('negative', economizado < 0);
    savedValue.classList.toggle('balance', economizado >= 0);

    sideSavedValue.textContent = formatMoney(economizado);
    sideSavedBar.style.width = `${Math.min(100, Math.max(0, percent))}%`;
    sideSavedNote.textContent = totalRec > 0 ? `${percent}% da receita do mês` : 'Sem receitas neste mês';
}

function renderDonut() {
    const { desMes, totalDes } = monthStats();

    donutTotal.textContent = formatMoney(totalDes);
    donutLegend.innerHTML = '';

    if (desMes.length === 0) {
        donut.style.background = '';
        donutLegend.appendChild(el('li', 'loading-text', 'Nenhum gasto neste mês'));
        return;
    }

    let acumulado = 0;
    const faixas = [];

    groupByCategory(desMes).forEach(([categoria, itens], i) => {
        const cor = CATEGORY_COLORS[i % CATEGORY_COLORS.length];
        const fatia = (sum(itens) / totalDes) * 100;
        faixas.push(`${cor} ${acumulado}% ${acumulado + fatia}%`);
        acumulado += fatia;

        const dot = el('span', 'legend-dot');
        dot.style.backgroundColor = cor;
        const li = el('li', 'legend-item');
        li.append(dot, el('span', 'legend-name', categoria), el('strong', null, `${Math.round(fatia)}%`));
        donutLegend.appendChild(li);
    });

    donut.style.background = `conic-gradient(${faixas.join(', ')})`;
}

function renderRecent() {
    const movimentos = [
        ...receitas.map(r => ({ ...r, kind: 'receita', quando: r.data })),
        ...despesas.map(d => ({ ...d, kind: 'despesa', quando: d.tipo === 'FIXA' ? d.dataInicio : d.data }))
    ]
        .sort((a, b) => (b.quando || '').localeCompare(a.quando || ''))
        .slice(0, 5);

    renderList(recentList, movimentos, 'Nenhuma movimentação até o momento', m =>
        m.kind === 'receita'
            ? createListItem(m.nome, `Receita · ${formatDate(m.data)}`, m.valor, 'positive')
            : createListItem(m.nome, expenseMeta(m, true), m.valor, 'negative')
    );
}

function renderHighlights() {
    const { desMes, totalRec, totalDes, totalFixas, economizado } = monthStats();
    const linhas = [];

    if (desMes.length > 0) {
        const [categoria, itens] = groupByCategory(desMes)[0];
        linhas.push(`Maior gasto do mês: ${categoria} (${formatMoney(sum(itens))})`);
    }
    if (totalRec > 0 && totalFixas > 0) {
        linhas.push(`Despesas fixas usam ${Math.round((totalFixas / totalRec) * 100)}% da receita do mês`);
    }
    if (totalRec > 0 || totalDes > 0) {
        linhas.push(economizado >= 0 ? 'Você está economizando neste mês' : 'Seus gastos passaram da receita neste mês');
    }

    highlights.innerHTML = '';
    if (linhas.length === 0) {
        highlights.appendChild(el('li', 'loading-text', 'Sem destaques por enquanto'));
        return;
    }
    linhas.forEach(texto => {
        const li = el('li', 'list-item');
        li.appendChild(el('span', 'item-name', texto));
        highlights.appendChild(li);
    });
}

// =====================================
// TEMA (CLARO / ESCURO)
// =====================================
function initTheme() {
    const toggle = document.getElementById('themeToggle');
    toggle.checked = document.documentElement.dataset.theme === 'dark';

    toggle.addEventListener('change', () => {
        const tema = toggle.checked ? 'dark' : 'light';
        document.documentElement.dataset.theme = tema;
        try {
            localStorage.setItem('gemicaTheme', tema);
        } catch (e) { /* sem storage disponível: o tema vale só nesta visita */ }
    });
}

// =====================================
// NAVEGAÇÃO
// =====================================
function switchSection(name) {
    sections.forEach(s => s.classList.toggle('section-active', s.id === `${name}Section`));
    navBtns.forEach(b => b.classList.toggle('nav-btn-active', b.dataset.section === name));
}

// =====================================
// DESPESAS POR CATEGORIA
// =====================================
function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
}

function barEl(percent, cssClass) {
    const track = el('div', 'bar-track');
    const fill = el('div', `bar-fill ${cssClass}`);
    fill.style.width = `${Math.min(100, Math.max(0, percent))}%`;
    track.appendChild(fill);
    return track;
}

function groupByCategory(list) {
    const groups = {};
    list.forEach(d => {
        const categoria = d.categoria || 'Outros';
        (groups[categoria] = groups[categoria] || []).push(d);
    });
    return Object.entries(groups).sort((a, b) => sum(b[1]) - sum(a[1]));
}

function expenseMeta(d, withCategory = false) {
    const base = d.tipo === 'FIXA'
        ? `Fixa · ${formatDate(d.dataInicio)} a ${formatDate(d.dataFim)}`
        : `Única · ${formatDate(d.data)}`;
    return withCategory ? `${base} · ${d.categoria}` : base;
}

function renderExpenseGroups() {
    expenseGroups.innerHTML = '';

    if (despesas.length === 0) {
        expenseGroups.appendChild(el('p', 'loading-text', 'Nenhum gasto até o momento'));
        return;
    }

    const total = sum(despesas);

    groupByCategory(despesas).forEach(([categoria, itens]) => {
        const subtotal = sum(itens);
        const card = el('div', 'card');

        const head = el('div', 'category-head');
        head.append(
            el('span', null, `${categoria} (${itens.length})`),
            el('strong', 'item-value negative', formatMoney(subtotal))
        );

        const list = el('ul', 'list');
        itens.forEach(d => list.appendChild(createListItem(d.nome, expenseMeta(d), d.valor, 'negative')));

        card.append(head, barEl((subtotal / total) * 100, 'bar-spent'), list);
        expenseGroups.appendChild(card);
    });
}

// =====================================
// RELATÓRIO DO MÊS
// =====================================
function statCard(label, value, cssClass) {
    const card = el('div', 'card');
    card.append(el('p', 'stat-label', label), el('p', `stat-value ${cssClass}`, formatMoney(value)));
    return card;
}

function reportBlock(title, items, emptyText, buildItem) {
    const wrap = el('div');
    const list = el('ul', 'list');
    renderList(list, items, emptyText, buildItem);
    wrap.append(el('h3', 'report-subtitle', title), list);
    return wrap;
}

function renderReport() {
    const mes = new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    const { recMes, desMes, fixas, unicas, totalRec, totalDes, economizado, percent } = monthStats();

    let resumo;
    if (recMes.length === 0 && desMes.length === 0) {
        resumo = 'Nenhuma movimentação neste mês.';
    } else if (economizado >= 0) {
        resumo = `Você economizou ${formatMoney(economizado)}, ${percent}% da sua receita do mês.`;
    } else {
        resumo = `Você gastou ${formatMoney(-economizado)} a mais do que recebeu neste mês.`;
    }

    const head = el('div', 'card card-balance');
    head.append(el('h2', 'card-title', `Relatório de ${mes}`), el('p', 'report-highlight', resumo));
    if (economizado > 0) head.appendChild(barEl(percent, 'bar-saved'));

    const stats = el('div', 'summary-grid');
    stats.append(
        statCard('Receitas do mês', totalRec, 'positive'),
        statCard('Gastos do mês', totalDes, 'negative'),
        statCard('Economizado', economizado, economizado < 0 ? 'negative' : 'balance')
    );

    const details = el('div', 'card');
    details.append(
        el('h2', 'card-title', 'O que você fez este mês'),
        reportBlock('Receitas recebidas', recMes, 'Nenhuma receita neste mês',
            r => createListItem(r.nome, formatDate(r.data), r.valor, 'positive')),
        reportBlock('Despesas únicas', unicas, 'Nenhuma despesa única neste mês',
            d => createListItem(d.nome, expenseMeta(d, true), d.valor, 'negative')),
        reportBlock('Despesas fixas', fixas, 'Nenhuma despesa fixa neste mês',
            d => createListItem(d.nome, expenseMeta(d, true), d.valor, 'negative'))
    );

    const cats = el('div', 'card');
    cats.appendChild(el('h2', 'card-title', 'Gastos por categoria'));
    if (desMes.length === 0) {
        cats.appendChild(el('p', 'loading-text', 'Nenhum gasto neste mês'));
    }
    groupByCategory(desMes).forEach(([categoria, itens]) => {
        const subtotal = sum(itens);
        const percentCat = (subtotal / totalDes) * 100;
        const row = el('div', 'chart-row');
        const rowHead = el('div', 'chart-row-head');
        rowHead.append(
            el('span', null, `${categoria} (${Math.round(percentCat)}%)`),
            el('strong', null, formatMoney(subtotal))
        );
        row.append(rowHead, barEl(percentCat, 'bar-spent'));
        cats.appendChild(row);
    });

    reportContainer.replaceChildren(head, stats, details, cats);
}

// =====================================
// FUNÇÕES DE API
// =====================================
async function loadData() {
    try {
        const [resReceitas, resDespesas] = await Promise.all([
            fetch(`${API_URL}/receita/get`),
            fetch(`${API_URL}/despesa/get`)
        ]);
        if (resReceitas.ok) receitas = await resReceitas.json();
        if (resDespesas.ok) despesas = await resDespesas.json();
    } catch (error) {
        // Backend ainda sem esses endpoints: segue com listas vazias
        console.warn('Não foi possível carregar receitas/despesas:', error);
    }
    render();
}

async function postJson(path, body) {
    try {
        const response = await fetch(`${API_URL}${path}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        return response.ok;
    } catch (error) {
        console.error('Erro ao enviar dados:', error);
        return false;
    }
}

async function handleCreateIncome(e) {
    e.preventDefault();

    const receita = {
        nome: incomeName.value.trim(),
        valor: parseFloat(incomeValue.value),
        data: incomeDate.value
    };

    saveIncomeBtn.disabled = true;
    const ok = await postJson('/receita/post', receita);
    saveIncomeBtn.disabled = false;

    receitas.push(receita);
    closeModals();
    render();
    showMessage(
        ok ? 'Receita registrada com sucesso!' : 'Receita adicionada apenas na tela (endpoint ainda não disponível).',
        ok ? 'success' : 'info'
    );
}

async function handleCreateExpense(e) {
    e.preventDefault();

    const tipo = getTipoSelecionado();
    const despesa = {
        tipo,
        nome: expenseName.value.trim(),
        valor: parseFloat(expenseValue.value),
        categoria: expenseCategory.value
    };

    if (tipo === 'FIXA') {
        despesa.dataInicio = expenseStart.value;
        despesa.dataFim = expenseEnd.value;
        if (despesa.dataFim < despesa.dataInicio) {
            showMessage('A data de fim deve ser depois da data de início', 'error');
            return;
        }
    } else {
        despesa.data = expenseDate.value;
    }

    saveExpenseBtn.disabled = true;
    const ok = await postJson('/despesa/post', despesa);
    saveExpenseBtn.disabled = false;

    despesas.push(despesa);
    closeModals();
    render();
    showMessage(
        ok ? 'Despesa registrada com sucesso!' : 'Despesa adicionada apenas na tela (endpoint ainda não disponível).',
        ok ? 'success' : 'info'
    );
}

// =====================================
// EVENT LISTENERS
// =====================================
document.addEventListener('DOMContentLoaded', () => {
    navBtns.forEach(btn => btn.addEventListener('click', () => switchSection(btn.dataset.section)));

    document.querySelectorAll('.js-open-income').forEach(btn => btn.addEventListener('click', () => {
        incomeDate.valueAsDate = new Date();
        openModal(incomeModal);
    }));

    document.querySelectorAll('.js-open-expense').forEach(btn => btn.addEventListener('click', () => {
        expenseDate.valueAsDate = new Date();
        openModal(expenseModal);
    }));

    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('usuarioLogado');
        window.location.href = 'telaLogin.html';
    });

    document.querySelectorAll('[data-close]').forEach(btn => btn.addEventListener('click', closeModals));

    // Fecha o modal ao clicar fora
    [incomeModal, expenseModal].forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModals();
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModals();
    });

    document.querySelectorAll('input[name="tipo"]').forEach(radio => {
        radio.addEventListener('change', toggleTipoDespesa);
    });

    incomeForm.addEventListener('submit', handleCreateIncome);
    expenseForm.addEventListener('submit', handleCreateExpense);

    initTheme();
    toggleTipoDespesa();
    renderUser();
    loadData();
});
