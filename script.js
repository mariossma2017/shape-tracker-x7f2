/* =====================================================================
   PROJETO SHAPE DE PAI — Controle de Dieta, Treino e Performance
   App 100% client-side (HTML/CSS/JS puro), dados em localStorage.
   ===================================================================== */

/* ===================== CHAVES DE ARMAZENAMENTO ===================== */
const LS = {
  config: 'psp_config',
  dieta: 'psp_dieta',
  treino: 'psp_treino',
  suplementos: 'psp_suplementos',
  registros: 'psp_registros',
  ultimaCarga: 'psp_ultima_carga',
  evolucao: 'psp_evolucao',
  backupMeta: 'psp_backup_meta',
};

const DIAS_SEMANA_NOME = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
const DIAS_SEMANA_KEY = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'];
const CARDIO_INFO = 'Cardio em jejum ou após o treino, 6x na semana · 40–45min caminhada moderada (velocidade 7 ou inclinação 10 com velocidade 5) · horário habitual 06:00–06:45.';

/* ===================== DADOS INICIAIS (SEED) — protocolo real ===================== */
function seedConfig() {
  return {
    nome: 'Mario Viana',
    altura: 180,
    pesoRef: 105,
    metaAgua: 5,
    tema: 'auto',
    dataInicio: '2026-07-20',
  };
}

function seedDieta() {
  return [
    { id: 'r1', ordem: 1, nome: 'Refeição 1 · Pós-jejum / Café da manhã', horario: '07:15',
      itens: ['4 ovos inteiros (mexidos ou cozidos)', '1 fatia de pão de forma integral', '100g de morango ou melancia'],
      kcal: 352, proteina: 26, carbo: 17, gordura: 20 },
    { id: 'r2', ordem: 2, nome: 'Refeição 2 · Lanche da manhã', horario: '10:30',
      itens: ['30g de whey protein', '20g de castanha de caju ou pará'],
      kcal: 234, proteina: 27, carbo: 9, gordura: 10 },
    { id: 'r3', ordem: 3, nome: 'Refeição 3 · Almoço', horario: '13:30',
      itens: ['200g de peito de frango grelhado', '100g de arroz branco cozido', 'Salada de folhas verdes à vontade', '1 colher de sopa (12ml) de azeite de oliva extra virgem'],
      kcal: 513, proteina: 62, carbo: 28, gordura: 17 },
    { id: 'r4', ordem: 4, nome: 'Refeição 4 · Lanche da tarde', horario: '16:30',
      itens: ['150g de iogurte desnatado natural', '30g de whey protein', '15g de aveia em flocos'],
      kcal: 235, proteina: 32, carbo: 20, gordura: 3 },
    { id: 'r5', ordem: 5, nome: 'Refeição 5 · Pré-treino', horario: '18:30',
      itens: ['150g de arroz branco cozido', '150g de patinho moído'],
      kcal: 411, proteina: 45, carbo: 42, gordura: 7 },
    { id: 'r6', ordem: 6, nome: 'Refeição 6 · Pós-treino', horario: '21:30',
      itens: ['200g de peito de frango grelhado', '150g de arroz branco cozido', 'Vegetais cozidos à vontade'],
      kcal: 461, proteina: 62, carbo: 42, gordura: 5 },
    { id: 'r7', ordem: 7, nome: 'Ceia · Antes de dormir', horario: '23:00',
      itens: ['35g de whey protein', '100g de abacate'],
      kcal: 209, proteina: 26, carbo: 6, gordura: 9 },
  ];
}

function descansoAtivo() {
  return {
    nome: 'Descanso Ativo', tipo: 'descanso', exercicios: [],
    extra: ['Caminhada leve 35–45min OU bicicleta leve', 'Alongamento/mobilidade: lombar / quadril / posterior / torácica'],
  };
}

function ex(nome, series, reps) { return { id: uid(), nome, series, reps }; }

function seedTreino() {
  return {
    dom: descansoAtivo(),
    seg: { nome: 'Push', tipo: 'treino', descricao: 'Peitoral, ombro e tríceps com foco em força e densidade.', exercicios: [
      ex('Supino inclinado máquina', 4, 10), ex('Supino reto máquina', 4, 10), ex('Crucifixo máquina', 3, 15),
      ex('Desenvolvimento máquina', 4, 10), ex('Elevação lateral', 4, 15), ex('Tríceps corda', 4, 12), ex('Tríceps francês', 3, 12),
    ] },
    ter: { nome: 'Pull', tipo: 'treino', descricao: 'Costas, dorsal e bíceps com foco em volume e postura.', exercicios: [
      ex('Puxada frontal', 4, 10), ex('Remada baixa', 4, 10), ex('Remada articulada', 4, 12),
      ex('Pulldown', 3, 15), ex('Encolhimento', 4, 12), ex('Rosca direta', 4, 12), ex('Rosca martelo', 3, 12),
    ] },
    qua: { nome: 'Legs', tipo: 'treino', descricao: 'Grande gasto calórico e fortalecimento de pernas.', exercicios: [
      ex('Agachamento guiado', 4, 10), ex('Leg press', 4, 15), ex('Afundo máquina', 3, 12),
      ex('Mesa flexora', 4, 12), ex('Cadeira extensora', 4, 15), ex('Panturrilha sentado', 5, 15),
    ] },
    qui: descansoAtivo(),
    sex: { nome: 'Full Upper', tipo: 'treino', descricao: 'Aumento de gasto calórico, força e densidade geral.', exercicios: [
      ex('Supino inclinado', 4, 10), ex('Puxada frontal', 4, 10), ex('Remada articulada', 4, 12),
      ex('Desenvolvimento máquina', 4, 10), ex('Elevação lateral', 4, 15), ex('Rosca direta', 3, 12), ex('Tríceps corda', 3, 12),
    ] },
    sab: { nome: 'Full Lower', tipo: 'treino', descricao: 'Foco metabólico, posterior e condicionamento.', exercicios: [
      ex('Stiff', 4, 10), ex('Mesa flexora', 4, 12), ex('Leg press', 4, 20),
      ex('Passada', 3, 12), ex('Extensora', 3, 20), ex('Panturrilha em pé', 5, 15),
    ] },
  };
}

const ABDOMINAIS = [
  { id: 'abd1', nome: 'Supra Solo', meta: '3x15–20' },
  { id: 'abd2', nome: 'Infra Reverso', meta: '3x12–15 (controlado, sem embalo)' },
  { id: 'abd3', nome: 'Prancha Frontal', meta: '3x 30–45s' },
];

function seedSuplementos() {
  return [
    { id: 'nac', nome: 'NAC (N-Acetilcisteína)', dose: '600mg', momento: 'Ao acordar, em jejum' },
    { id: 'omega3', nome: 'Ômega 3 (alto EPA/DHA)', dose: '2g', momento: 'Junto com o almoço' },
    { id: 'coq10', nome: 'Coenzima Q10', dose: '100mg', momento: 'Junto com o almoço' },
    { id: 'melatonina', nome: 'Melatonina', dose: '3mg', momento: '30 min antes de dormir' },
  ];
}

function seedEvolucao() {
  return [
    { id: uid(), data: '2026-07-20', peso: 105, bf: null, cintura: 99, quadril: 106, abdomen: null, peitoral: null, braco: null, coxa: null, panturrilha: null, pressao: '', foto: null },
  ];
}

/* ===================== HELPERS ===================== */
function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }

function todayISO() { return dateISO(new Date()); }
function dateISO(d) {
  const y = d.getFullYear(), m = String(d.getMonth() + 1).padStart(2, '0'), day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
function parseISO(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}
function addDias(iso, n) {
  const d = parseISO(iso);
  d.setDate(d.getDate() + n);
  return dateISO(d);
}
function formatDataBR(iso) {
  const d = parseISO(iso);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}
function weekdayKey(iso) { return DIAS_SEMANA_KEY[parseISO(iso).getDay()]; }
function weekdayNome(iso) { return DIAS_SEMANA_NOME[parseISO(iso).getDay()]; }

function parseNum(str) {
  if (str === null || str === undefined) return null;
  str = String(str).trim();
  if (!str) return null;
  str = str.replace(',', '.');
  const n = parseFloat(str);
  return isNaN(n) ? null : n;
}
function formatNum(n, casas) {
  if (n === null || n === undefined || isNaN(n)) return '';
  casas = casas === undefined ? 1 : casas;
  return n.toFixed(casas).replace('.', ',').replace(/,0+$/, '').replace(/(,\d*[1-9])0+$/, '$1');
}

function corPorPercentual(pct) {
  if (pct >= 85) return 'var(--green)';
  if (pct >= 50) return 'var(--yellow)';
  return 'var(--red)';
}

function getBanda(score) {
  if (score >= 95) return { label: 'Dia Perfeito', emoji: '🟢', color: 'var(--green)', cls: 'verde' };
  if (score >= 85) return { label: 'Excelente', emoji: '🔵', color: 'var(--blue)', cls: 'azul' };
  if (score >= 70) return { label: 'Bom', emoji: '🟡', color: 'var(--yellow)', cls: 'amarelo' };
  if (score >= 50) return { label: 'Atenção', emoji: '🟠', color: 'var(--orange)', cls: 'laranja' };
  return { label: 'Fora do Protocolo', emoji: '🔴', color: 'var(--red)', cls: 'vermelho' };
}

function escapeHtml(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

/* ===================== ARMAZENAMENTO ===================== */
function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) { return fallback; }
}
function saveJSON(key, value) { localStorage.setItem(key, JSON.stringify(value)); }

let DB = {};

function initData() {
  DB.config = loadJSON(LS.config, null) || seedConfig();
  DB.dieta = loadJSON(LS.dieta, null) || seedDieta();
  DB.treino = loadJSON(LS.treino, null) || seedTreino();
  DB.suplementos = loadJSON(LS.suplementos, null) || seedSuplementos();
  DB.registros = loadJSON(LS.registros, null) || {};
  DB.ultimaCarga = loadJSON(LS.ultimaCarga, null) || {};
  DB.evolucao = loadJSON(LS.evolucao, null) || seedEvolucao();
  DB.backupMeta = loadJSON(LS.backupMeta, null) || { ultimoBackup: null };
  persistAll();
}
function persistAll() {
  saveJSON(LS.config, DB.config);
  saveJSON(LS.dieta, DB.dieta);
  saveJSON(LS.treino, DB.treino);
  saveJSON(LS.suplementos, DB.suplementos);
  saveJSON(LS.registros, DB.registros);
  saveJSON(LS.ultimaCarga, DB.ultimaCarga);
  saveJSON(LS.evolucao, DB.evolucao);
  saveJSON(LS.backupMeta, DB.backupMeta);
}

function getRegistro(iso) {
  if (!DB.registros[iso]) {
    DB.registros[iso] = { dieta: {}, treino: {}, abdominais: {}, cardio: null, agua: 0, aguaHistorico: [], suplementos: {} };
  }
  const r = DB.registros[iso];
  if (!r.dieta) r.dieta = {};
  if (!r.treino) r.treino = {};
  if (!r.abdominais) r.abdominais = {};
  if (r.agua === undefined) r.agua = 0;
  if (!r.aguaHistorico) r.aguaHistorico = [];
  if (!r.suplementos) r.suplementos = {};
  return r;
}
function saveRegistro(iso) { saveJSON(LS.registros, DB.registros); }

/* ===================== ESTADO GLOBAL ===================== */
const state = {
  view: 'hoje',
  viewDate: todayISO(),
  calMes: (() => { const d = new Date(); d.setDate(1); return d; })(),
  diaSelecionadoHistorico: null,
};

/* ===================== CÁLCULO DE ADERÊNCIA ===================== */
function calcularAderencia(iso) {
  const reg = getRegistro(iso);
  const diaKey = weekdayKey(iso);
  const treinoDia = DB.treino[diaKey];

  // Dieta
  const refeicoes = DB.dieta;
  let dietaSoma = 0;
  refeicoes.forEach(r => {
    const st = reg.dieta[r.id] && reg.dieta[r.id].status;
    if (st === 'conforme') dietaSoma += 1;
    else if (st === 'parcial') dietaSoma += 0.5;
  });
  const dietaPct = refeicoes.length ? (dietaSoma / refeicoes.length) * 100 : 100;

  // Treino
  let treinoPct = 100;
  if (treinoDia && treinoDia.tipo === 'treino' && treinoDia.exercicios.length) {
    let feitos = 0;
    treinoDia.exercicios.forEach(e => { if (reg.treino[e.id] && reg.treino[e.id].concluido) feitos += 1; });
    treinoPct = (feitos / treinoDia.exercicios.length) * 100;
  }

  // Cardio
  let cardioPct = reg.cardio === 'sim' ? 100 : (reg.cardio === 'nao' ? 0 : 0);

  // Água
  const metaMl = (DB.config.metaAgua || 5) * 1000;
  const aguaPct = metaMl ? Math.min(100, (reg.agua / metaMl) * 100) : 0;

  // Suplementação
  const totalSup = DB.suplementos.length || 1;
  let supFeitos = 0;
  DB.suplementos.forEach(s => { if (reg.suplementos[s.id]) supFeitos += 1; });
  const supPct = (supFeitos / totalSup) * 100;

  const score = Math.round(dietaPct * 0.40 + treinoPct * 0.25 + cardioPct * 0.15 + aguaPct * 0.10 + supPct * 0.10);

  return { score, dietaPct, treinoPct, cardioPct, aguaPct, supPct };
}

/* ===================== NAVEGAÇÃO ===================== */
const TITULOS_VIEW = { hoje: 'Hoje', treino: 'Treino', dieta: 'Dieta', evolucao: 'Evolução', historico: 'Histórico', config: 'Ajustes' };

function switchView(view) {
  state.view = view;
  document.querySelectorAll('.view').forEach(v => v.hidden = true);
  document.getElementById('view-' + view).hidden = false;
  document.querySelectorAll('.tab-item').forEach(t => t.classList.toggle('active', t.dataset.view === view));
  document.getElementById('topbarTitle').textContent = TITULOS_VIEW[view];
  document.getElementById('content').scrollTop = 0;
  renderView(view);
}
function renderView(view) {
  if (view === 'hoje') renderHoje();
  else if (view === 'treino') renderTreino();
  else if (view === 'dieta') renderDieta();
  else if (view === 'evolucao') renderEvolucao();
  else if (view === 'historico') renderHistorico();
  else if (view === 'config') renderConfig();
}
function renderAtual() { renderView(state.view); }

/* ===================== TOAST ===================== */
let toastTimer = null;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.hidden = true; }, 2200);
}

/* ===================== TELA HOJE ===================== */
function saudacao() {
  const h = new Date().getHours();
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
}

function renderHoje() {
  const iso = state.viewDate;
  const ehHoje = iso === todayISO();
  document.getElementById('greetHello').textContent = ehHoje ? `${saudacao()}, ${DB.config.nome.split(' ')[0]}` : 'Registro de';
  document.getElementById('greetDate').textContent = `${weekdayNome(iso)} · ${formatDataBR(iso)}`;

  const ad = calcularAderencia(iso);
  const banda = getBanda(ad.score);
  const CIRC = 2 * Math.PI * 60;
  const offset = CIRC - (ad.score / 100) * CIRC;
  const fg = document.getElementById('scoreRingFg');
  fg.style.strokeDasharray = CIRC;
  fg.style.strokeDashoffset = offset;
  fg.style.stroke = banda.color;
  document.getElementById('scoreNum').textContent = ad.score;
  document.getElementById('scoreBand').textContent = `${banda.emoji} ${banda.label}`;
  document.getElementById('scoreBand').style.color = banda.color;

  const cats = [
    { nome: 'Treino', pct: ad.treinoPct },
    { nome: 'Dieta', pct: ad.dietaPct },
    { nome: 'Cardio', pct: ad.cardioPct },
    { nome: 'Água', pct: ad.aguaPct },
    { nome: 'Suplementação', pct: ad.supPct },
  ];
  document.getElementById('catGrid').innerHTML = cats.map(c => `
    <div class="cat-card">
      <div class="cat-card-top">
        <span class="cat-card-name">${c.nome}</span>
        <span class="cat-card-pct" style="color:${corPorPercentual(c.pct)}">${Math.round(c.pct)}%</span>
      </div>
      <div class="cat-bar"><div class="cat-bar-fill" style="width:${c.pct}%; background:${corPorPercentual(c.pct)}"></div></div>
    </div>`).join('');

  renderPendentes(iso);
  renderAgua(iso);
  renderCardio(iso);
  renderSuplementosHoje(iso);
}

function renderPendentes(iso) {
  const reg = getRegistro(iso);
  const diaKey = weekdayKey(iso);
  const treinoDia = DB.treino[diaKey];
  const itens = [];

  DB.dieta.forEach(r => {
    if (!reg.dieta[r.id] || !reg.dieta[r.id].status) {
      itens.push({ label: r.nome, tempo: r.horario, acao: () => switchView('dieta') });
    }
  });

  if (treinoDia && treinoDia.tipo === 'treino') {
    treinoDia.exercicios.forEach(e => {
      if (!reg.treino[e.id] || !reg.treino[e.id].concluido) {
        itens.push({ label: `Treino: ${e.nome}`, tempo: `${e.series}x${e.reps}`, acao: () => switchView('treino') });
      }
    });
  }

  if (!reg.cardio) itens.push({ label: 'Cardio', tempo: '', acao: () => document.getElementById('cardCardio').scrollIntoView({ behavior: 'smooth', block: 'center' }) });

  const metaMl = (DB.config.metaAgua || 5) * 1000;
  if (reg.agua < metaMl) {
    const faltamL = ((metaMl - reg.agua) / 1000).toFixed(2).replace(/\.?0+$/, '').replace('.', ',');
    itens.push({ label: 'Água', tempo: `faltam ${faltamL} L`, acao: () => document.getElementById('cardAgua').scrollIntoView({ behavior: 'smooth', block: 'center' }) });
  }

  DB.suplementos.forEach(s => {
    if (!reg.suplementos[s.id]) itens.push({ label: `Suplemento: ${s.nome}`, tempo: s.momento, acao: () => document.getElementById('cardSuplementos').scrollIntoView({ behavior: 'smooth', block: 'center' }) });
  });

  const el = document.getElementById('listaPendentes');
  const vazio = document.getElementById('pendentesVazio');
  if (!itens.length) {
    el.innerHTML = '';
    vazio.hidden = false;
  } else {
    vazio.hidden = true;
    el.innerHTML = '';
    itens.forEach((it, idx) => {
      const div = document.createElement('div');
      div.className = 'pending-item';
      div.innerHTML = `<span class="pending-check"></span><span class="pending-label">${escapeHtml(it.label)}</span><span class="pending-time">${escapeHtml(it.tempo)}</span>`;
      div.addEventListener('click', it.acao);
      el.appendChild(div);
    });
  }
}

function renderAgua(iso) {
  const reg = getRegistro(iso);
  const metaMl = (DB.config.metaAgua || 5) * 1000;
  const pct = metaMl ? Math.min(100, (reg.agua / metaMl) * 100) : 0;
  document.getElementById('aguaFill').style.height = pct + '%';
  document.getElementById('aguaAtual').textContent = formatNum(reg.agua / 1000, 2);
  document.getElementById('aguaMeta').textContent = formatNum(metaMl / 1000, 1);
  document.getElementById('aguaPct').textContent = Math.round(pct) + '%';
  const restanteL = Math.max(0, (metaMl - reg.agua) / 1000);
  document.getElementById('aguaRestante').textContent = restanteL > 0 ? `Restante: ${formatNum(restanteL, 2)} L` : 'Meta atingida! 🎉';
  document.getElementById('cardioHorarioInfo').textContent = CARDIO_INFO;
}

function renderCardio(iso) {
  const reg = getRegistro(iso);
  document.getElementById('btnCardioSim').classList.toggle('is-active', reg.cardio === 'sim');
  document.getElementById('btnCardioSim').classList.toggle('tone-green', reg.cardio === 'sim');
  document.getElementById('btnCardioNao').classList.toggle('is-active', reg.cardio === 'nao');
  document.getElementById('btnCardioNao').classList.toggle('tone-red', reg.cardio === 'nao');
}

function renderSuplementosHoje(iso) {
  const reg = getRegistro(iso);
  const el = document.getElementById('listaSuplementosHoje');
  el.innerHTML = DB.suplementos.map(s => `
    <div class="supl-item">
      <div class="supl-info">
        <div class="supl-nome">${escapeHtml(s.nome)} <span class="muted small">${escapeHtml(s.dose)}</span></div>
        <div class="supl-momento">${escapeHtml(s.momento)}</div>
      </div>
      <button class="supl-toggle ${reg.suplementos[s.id] ? 'is-on' : ''}" data-sup="${s.id}">${reg.suplementos[s.id] ? 'Tomado ✓' : 'Marcar'}</button>
    </div>`).join('');
  el.querySelectorAll('[data-sup]').forEach(btn => {
    btn.addEventListener('click', () => {
      const r = getRegistro(iso);
      r.suplementos[btn.dataset.sup] = !r.suplementos[btn.dataset.sup];
      saveRegistro(iso);
      renderHoje();
    });
  });
}

/* ===================== TELA TREINO ===================== */
function renderTreino() {
  const iso = state.viewDate;
  const diaKey = weekdayKey(iso);
  const treinoDia = DB.treino[diaKey];
  const reg = getRegistro(iso);

  document.getElementById('treinoSubtitle').textContent = `${weekdayNome(iso)}, ${formatDataBR(iso)} · ${treinoDia.nome}`;

  const el = document.getElementById('treinoConteudo');

  if (treinoDia.tipo === 'descanso') {
    el.innerHTML = `
      <div class="treino-descanso">
        <p style="font-size:17px;font-weight:800;margin-bottom:8px;">🧘 Descanso Ativo</p>
        ${treinoDia.extra.map(t => `<p class="muted" style="margin-top:4px;">${escapeHtml(t)}</p>`).join('')}
      </div>`;
    return;
  }

  let html = treinoDia.exercicios.map(e => {
    const dado = reg.treino[e.id] || {};
    const ultima = DB.ultimaCarga[e.nome];
    const cargaVal = dado.carga !== undefined && dado.carga !== null ? dado.carga : (ultima ? ultima.carga : '');
    const repsVal = dado.reps !== undefined && dado.reps !== null ? dado.reps : (ultima ? ultima.reps : '');
    return `
    <div class="exercicio-card">
      <div class="exercicio-top">
        <div>
          <div class="exercicio-nome">${escapeHtml(e.nome)}</div>
          <div class="exercicio-meta">${e.series} séries x ${e.reps} repetições</div>
          ${ultima ? `<div class="exercicio-ultima">Última carga: ${formatNum(ultima.carga, 1)}kg</div>` : ''}
        </div>
        <button class="btn-concluir ${dado.concluido ? 'is-on' : ''}" data-ex-concluir="${e.id}">${dado.concluido ? 'Concluído ✓' : 'Concluir'}</button>
      </div>
      <div class="exercicio-row">
        <input class="exercicio-input" type="text" inputmode="decimal" placeholder="Carga (kg)" data-ex-carga="${e.id}" value="${cargaVal === '' ? '' : formatNum(cargaVal, 1)}">
        <input class="exercicio-input" type="number" inputmode="numeric" placeholder="Reps feitas" data-ex-reps="${e.id}" value="${repsVal === '' ? '' : repsVal}">
      </div>
    </div>`;
  }).join('');

  html += `<div class="treino-dia-titulo">Abdominais (opcional · 2x por semana)</div>`;
  html += ABDOMINAIS.map(a => {
    const done = reg.abdominais[a.id];
    return `
    <div class="exercicio-card">
      <div class="exercicio-top">
        <div>
          <div class="exercicio-nome">${escapeHtml(a.nome)}</div>
          <div class="exercicio-meta">${escapeHtml(a.meta)}</div>
        </div>
        <button class="btn-concluir ${done ? 'is-on' : ''}" data-abd-concluir="${a.id}">${done ? 'Feito ✓' : 'Concluir'}</button>
      </div>
    </div>`;
  }).join('');

  el.innerHTML = html;

  el.querySelectorAll('[data-ex-concluir]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.exConcluir;
      const r = getRegistro(iso);
      if (!r.treino[id]) r.treino[id] = {};
      r.treino[id].concluido = !r.treino[id].concluido;
      saveRegistro(iso);
      renderTreino();
      if (state.view === 'hoje') renderHoje();
    });
  });
  el.querySelectorAll('[data-abd-concluir]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.abdConcluir;
      const r = getRegistro(iso);
      r.abdominais[id] = !r.abdominais[id];
      saveRegistro(iso);
      renderTreino();
    });
  });
  el.querySelectorAll('[data-ex-carga]').forEach(inp => {
    inp.addEventListener('change', () => salvarCargaExercicio(iso, treinoDia, inp.dataset.exCarga));
  });
  el.querySelectorAll('[data-ex-reps]').forEach(inp => {
    inp.addEventListener('change', () => salvarCargaExercicio(iso, treinoDia, inp.dataset.exReps));
  });
}

function salvarCargaExercicio(iso, treinoDia, exId) {
  const exObj = treinoDia.exercicios.find(e => e.id === exId);
  if (!exObj) return;
  const cargaInp = document.querySelector(`[data-ex-carga="${exId}"]`);
  const repsInp = document.querySelector(`[data-ex-reps="${exId}"]`);
  const carga = parseNum(cargaInp.value);
  const reps = repsInp.value ? parseInt(repsInp.value, 10) : null;
  const r = getRegistro(iso);
  if (!r.treino[exId]) r.treino[exId] = {};
  r.treino[exId].carga = carga;
  r.treino[exId].reps = reps;
  saveRegistro(iso);
  if (carga !== null) {
    DB.ultimaCarga[exObj.nome] = { carga, reps, data: iso };
    saveJSON(LS.ultimaCarga, DB.ultimaCarga);
  }
}

/* ===================== TELA DIETA ===================== */
function renderDieta() {
  const iso = state.viewDate;
  const reg = getRegistro(iso);
  const totalKcal = DB.dieta.reduce((s, r) => s + (r.kcal || 0), 0);
  const totalP = DB.dieta.reduce((s, r) => s + (r.proteina || 0), 0);
  const totalC = DB.dieta.reduce((s, r) => s + (r.carbo || 0), 0);
  const totalG = DB.dieta.reduce((s, r) => s + (r.gordura || 0), 0);
  document.querySelector('#view-dieta .subtitle').innerHTML = `~${totalKcal} kcal/dia · P ${totalP}g · C ${totalC}g · G ${totalG}g`;

  const el = document.getElementById('dietaConteudo');
  el.innerHTML = DB.dieta.slice().sort((a, b) => a.ordem - b.ordem).map(r => {
    const dado = reg.dieta[r.id] || {};
    return `
    <div class="refeicao-card">
      <div class="refeicao-top">
        <div class="refeicao-nome">${escapeHtml(r.nome)}</div>
        <div class="refeicao-horario">${escapeHtml(r.horario)}</div>
      </div>
      <div class="refeicao-itens">${r.itens.map(i => '• ' + escapeHtml(i)).join('<br>')}</div>
      <div class="refeicao-macros">~${r.kcal} kcal · Proteínas ${r.proteina}g · Carboidratos ${r.carbo}g · Gorduras ${r.gordura}g</div>
      <div class="seg-btns">
        <button class="btn btn-seg ${dado.status === 'conforme' ? 'is-active tone-green' : ''}" data-dieta="${r.id}" data-status="conforme">✅ Conforme</button>
        <button class="btn btn-seg ${dado.status === 'parcial' ? 'is-active' : ''}" data-dieta="${r.id}" data-status="parcial">🟨 Parcial</button>
        <button class="btn btn-seg ${dado.status === 'fora' ? 'is-active tone-red' : ''}" data-dieta="${r.id}" data-status="fora">❌ Fora</button>
      </div>
      <div class="refeicao-obs" ${dado.status === 'conforme' || !dado.status ? 'hidden' : ''} data-obs-wrap="${r.id}">
        <input type="text" placeholder="O que mudou? (opcional)" data-obs-input="${r.id}" value="${escapeHtml(dado.obs || '')}">
      </div>
    </div>`;
  }).join('');

  el.querySelectorAll('[data-dieta]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.dieta;
      const status = btn.dataset.status;
      const r = getRegistro(iso);
      if (!r.dieta[id]) r.dieta[id] = {};
      r.dieta[id].status = r.dieta[id].status === status ? null : status;
      saveRegistro(iso);
      renderDieta();
      if (state.view === 'hoje') renderHoje();
    });
  });
  el.querySelectorAll('[data-obs-input]').forEach(inp => {
    inp.addEventListener('change', () => {
      const id = inp.dataset.obsInput;
      const r = getRegistro(iso);
      if (!r.dieta[id]) r.dieta[id] = {};
      r.dieta[id].obs = inp.value;
      saveRegistro(iso);
      showToast('Observação salva');
    });
  });
}

/* ===================== TELA EVOLUÇÃO ===================== */
function renderEvolucao() {
  const lista = DB.evolucao.slice().sort((a, b) => a.data.localeCompare(b.data));
  const el = document.getElementById('listaEvolucao');
  const vazio = document.getElementById('evolucaoVazio');
  if (!lista.length) {
    el.innerHTML = '';
    vazio.hidden = false;
  } else {
    vazio.hidden = true;
    el.innerHTML = lista.slice().reverse().map(ev => {
      const partes = [];
      if (ev.peso != null) partes.push(`${formatNum(ev.peso, 1)}kg`);
      if (ev.bf != null) partes.push(`BF ${formatNum(ev.bf, 1)}%`);
      if (ev.cintura != null) partes.push(`Cintura ${formatNum(ev.cintura, 1)}cm`);
      return `
      <div class="evolucao-item">
        ${ev.foto ? `<img class="evolucao-thumb" src="${ev.foto}">` : ''}
        <div style="flex:1">
          <div class="evolucao-data">${formatDataBR(ev.data)}</div>
          <div class="evolucao-resumo">${partes.join(' · ') || 'Sem medidas numéricas'}</div>
        </div>
        <button class="evolucao-del" data-ev-del="${ev.id}">×</button>
      </div>`;
    }).join('');
    el.querySelectorAll('[data-ev-del]').forEach(btn => {
      btn.addEventListener('click', () => {
        confirmar('Excluir medição', 'Tem certeza que deseja excluir este registro de evolução?', () => {
          DB.evolucao = DB.evolucao.filter(e => e.id !== btn.dataset.evDel);
          saveJSON(LS.evolucao, DB.evolucao);
          renderEvolucao();
          showToast('Registro excluído');
        });
      });
    });
  }

  desenharGraficoEvolucao(lista);
}

function desenharGraficoEvolucao(lista) {
  const canvas = document.getElementById('chartEvolucao');
  const vazio = document.getElementById('chartEvolucaoVazio');
  const comPeso = lista.filter(e => e.peso != null);
  if (comPeso.length < 2) {
    canvas.hidden = true;
    vazio.hidden = false;
    return;
  }
  canvas.hidden = false;
  vazio.hidden = true;

  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  const pad = 30;
  const pesos = comPeso.map(e => e.peso);
  const min = Math.min(...pesos) - 1, max = Math.max(...pesos) + 1;
  const styles = getComputedStyle(document.documentElement);
  const corLinha = styles.getPropertyValue('--blue').trim() || '#0a84ff';
  const corTexto = styles.getPropertyValue('--text-muted').trim() || '#888';
  const corGrid = 'rgba(120,120,128,0.18)';

  ctx.strokeStyle = corGrid;
  ctx.lineWidth = 1;
  for (let i = 0; i <= 3; i++) {
    const y = pad + (H - pad * 2) * (i / 3);
    ctx.beginPath(); ctx.moveTo(pad, y); ctx.lineTo(W - 10, y); ctx.stroke();
    const val = max - (max - min) * (i / 3);
    ctx.fillStyle = corTexto; ctx.font = '11px sans-serif';
    ctx.fillText(formatNum(val, 1), 2, y + 4);
  }

  ctx.beginPath();
  comPeso.forEach((e, i) => {
    const x = pad + (W - pad - 20) * (i / (comPeso.length - 1));
    const y = pad + (H - pad * 2) * (1 - (e.peso - min) / (max - min));
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  });
  ctx.strokeStyle = corLinha;
  ctx.lineWidth = 2.5;
  ctx.lineJoin = 'round';
  ctx.stroke();

  comPeso.forEach((e, i) => {
    const x = pad + (W - pad - 20) * (i / (comPeso.length - 1));
    const y = pad + (H - pad * 2) * (1 - (e.peso - min) / (max - min));
    ctx.beginPath(); ctx.arc(x, y, 3.5, 0, Math.PI * 2); ctx.fillStyle = corLinha; ctx.fill();
  });
}

function bindFormEvolucao() {
  const form = document.getElementById('formEvolucao');
  document.getElementById('evData').value = todayISO();
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const foto = document.getElementById('evFoto').files[0];
    const salvar = (fotoDataUrl) => {
      const entry = {
        id: uid(),
        data: document.getElementById('evData').value || todayISO(),
        peso: parseNum(document.getElementById('evPeso').value),
        bf: parseNum(document.getElementById('evBF').value),
        cintura: parseNum(document.getElementById('evCintura').value),
        quadril: parseNum(document.getElementById('evQuadril').value),
        abdomen: parseNum(document.getElementById('evAbdomen').value),
        peitoral: parseNum(document.getElementById('evPeitoral').value),
        braco: parseNum(document.getElementById('evBraco').value),
        coxa: parseNum(document.getElementById('evCoxa').value),
        panturrilha: parseNum(document.getElementById('evPanturrilha').value),
        pressao: document.getElementById('evPressao').value || '',
        foto: fotoDataUrl || null,
      };
      DB.evolucao.push(entry);
      saveJSON(LS.evolucao, DB.evolucao);
      form.reset();
      document.getElementById('evData').value = todayISO();
      renderEvolucao();
      showToast('Medição salva');
    };
    if (foto) {
      const reader = new FileReader();
      reader.onload = () => salvar(reader.result);
      reader.readAsDataURL(foto);
    } else {
      salvar(null);
    }
  });
}

/* ===================== TELA HISTÓRICO (CALENDÁRIO) ===================== */
const MESES_NOME = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

function renderHistorico() {
  const mes = state.calMes;
  document.getElementById('calMesLabel').textContent = `${MESES_NOME[mes.getMonth()]} ${mes.getFullYear()}`;

  const primeiroDia = new Date(mes.getFullYear(), mes.getMonth(), 1);
  const ultimoDia = new Date(mes.getFullYear(), mes.getMonth() + 1, 0);
  const offset = primeiroDia.getDay();
  const totalDias = ultimoDia.getDate();
  const hojeIso = todayISO();

  const grid = document.getElementById('calGrid');
  let html = '';
  for (let i = 0; i < offset; i++) html += `<div class="cal-day is-empty"></div>`;
  for (let d = 1; d <= totalDias; d++) {
    const dateObj = new Date(mes.getFullYear(), mes.getMonth(), d);
    const iso = dateISO(dateObj);
    const futuro = iso > hojeIso;
    let cls = 'cal-day';
    if (futuro) cls += ' is-future';
    if (iso === hojeIso) cls += ' is-today';
    if (!futuro && DB.registros[iso]) {
      const ad = calcularAderencia(iso);
      cls += ' score-' + getBanda(ad.score).cls;
    }
    html += `<button class="${cls}" data-cal-dia="${iso}" ${futuro ? 'disabled' : ''}>${d}</button>`;
  }
  grid.innerHTML = html;
  grid.querySelectorAll('[data-cal-dia]').forEach(btn => {
    btn.addEventListener('click', () => mostrarDetalheDia(btn.dataset.calDia));
  });

  if (state.diaSelecionadoHistorico && state.diaSelecionadoHistorico.slice(0, 7) === dateISO(mes).slice(0, 7)) {
    mostrarDetalheDia(state.diaSelecionadoHistorico);
  } else {
    document.getElementById('painelDiaDetalhe').hidden = true;
  }
}

function mostrarDetalheDia(iso) {
  state.diaSelecionadoHistorico = iso;
  const painel = document.getElementById('painelDiaDetalhe');
  painel.hidden = false;
  document.getElementById('detalheDiaTitulo').textContent = `${weekdayNome(iso)}, ${formatDataBR(iso)}`;

  const reg = getRegistro(iso);
  const ad = calcularAderencia(iso);
  const banda = getBanda(ad.score);
  const diaKey = weekdayKey(iso);
  const treinoDia = DB.treino[diaKey];

  let html = `<div class="detalhe-linha"><strong>Pontuação</strong><strong style="color:${banda.color}">${ad.score} · ${banda.emoji} ${banda.label}</strong></div>`;

  html += `<div class="detalhe-secao"><div class="detalhe-secao-titulo">Dieta</div>`;
  DB.dieta.forEach(r => {
    const st = reg.dieta[r.id] && reg.dieta[r.id].status;
    const label = st === 'conforme' ? '✅ Conforme' : st === 'parcial' ? '🟨 Parcial' : st === 'fora' ? '❌ Fora' : '— Não marcado';
    html += `<div class="detalhe-linha"><span>${escapeHtml(r.nome)}</span><span>${label}</span></div>`;
  });
  html += `</div>`;

  html += `<div class="detalhe-secao"><div class="detalhe-secao-titulo">Treino</div>`;
  if (treinoDia.tipo === 'descanso') {
    html += `<div class="detalhe-linha"><span>Descanso ativo</span><span>${reg.cardio === 'sim' ? '✅' : '—'}</span></div>`;
  } else {
    treinoDia.exercicios.forEach(e => {
      const d = reg.treino[e.id] || {};
      const carga = d.carga != null ? `${formatNum(d.carga, 1)}kg` : '—';
      html += `<div class="detalhe-linha"><span>${escapeHtml(e.nome)}</span><span>${d.concluido ? '✅ ' + carga : '— não feito'}</span></div>`;
    });
  }
  html += `</div>`;

  html += `<div class="detalhe-secao"><div class="detalhe-secao-titulo">Cardio, Água e Suplementos</div>`;
  html += `<div class="detalhe-linha"><span>Cardio</span><span>${reg.cardio === 'sim' ? '✅ Sim' : reg.cardio === 'nao' ? '❌ Não' : '— não marcado'}</span></div>`;
  html += `<div class="detalhe-linha"><span>Água</span><span>${formatNum(reg.agua / 1000, 2)} L</span></div>`;
  DB.suplementos.forEach(s => {
    html += `<div class="detalhe-linha"><span>${escapeHtml(s.nome)}</span><span>${reg.suplementos[s.id] ? '✅' : '—'}</span></div>`;
  });
  html += `</div>`;

  document.getElementById('detalheDiaConteudo').innerHTML = html;
  painel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/* ===================== TELA CONFIGURAÇÕES ===================== */
function renderConfig() {
  document.getElementById('cfgNome').value = DB.config.nome || '';
  document.getElementById('cfgAltura').value = DB.config.altura != null ? formatNum(DB.config.altura, 0) : '';
  document.getElementById('cfgPeso').value = DB.config.pesoRef != null ? formatNum(DB.config.pesoRef, 1) : '';
  document.getElementById('cfgMetaAgua').value = DB.config.metaAgua != null ? formatNum(DB.config.metaAgua, 1) : '';

  document.querySelectorAll('#temaSeletor [data-theme]').forEach(b => b.classList.toggle('is-active', b.dataset.theme === DB.config.tema));

  renderBackupAviso();
  renderListaRefeicoesCfg();
  renderListaTreinoCfg();
  renderListaSuplementosCfg();
}

function renderBackupAviso() {
  const el = document.getElementById('backupAvisoInfo');
  const ultimo = DB.backupMeta.ultimoBackup;
  if (!ultimo) {
    el.textContent = 'Você ainda não fez nenhum backup. Recomendamos exportar uma cópia agora.';
    el.style.color = 'var(--red)';
    return;
  }
  const dias = Math.floor((parseISO(todayISO()) - parseISO(ultimo)) / 86400000);
  if (dias >= 7) {
    el.textContent = `Seu último backup foi realizado há ${dias} dias. Recomendamos exportar uma nova cópia.`;
    el.style.color = 'var(--orange)';
  } else {
    el.textContent = `Último backup: ${formatDataBR(ultimo)} (há ${dias} dia${dias === 1 ? '' : 's'}).`;
    el.style.color = 'var(--text-muted)';
  }
}

function renderListaRefeicoesCfg() {
  const el = document.getElementById('listaRefeicoesCfg');
  el.innerHTML = DB.dieta.slice().sort((a, b) => a.ordem - b.ordem).map(r => `
    <div class="cfg-item">
      <div class="cfg-item-info">
        <div class="cfg-item-nome">${escapeHtml(r.nome)}</div>
        <div class="cfg-item-sub">${escapeHtml(r.horario)} · ~${r.kcal} kcal</div>
      </div>
      <div class="cfg-item-actions">
        <button data-edit-refeicao="${r.id}">Editar</button>
        <button class="del" data-del-refeicao="${r.id}">Excluir</button>
      </div>
    </div>`).join('');
  el.querySelectorAll('[data-edit-refeicao]').forEach(b => b.addEventListener('click', () => abrirModalRefeicao(b.dataset.editRefeicao)));
  el.querySelectorAll('[data-del-refeicao]').forEach(b => b.addEventListener('click', () => {
    confirmar('Excluir refeição', 'Excluir esta refeição do protocolo? O histórico de dias já marcados será mantido.', () => {
      DB.dieta = DB.dieta.filter(r => r.id !== b.dataset.delRefeicao);
      saveJSON(LS.dieta, DB.dieta);
      renderListaRefeicoesCfg();
      showToast('Refeição excluída');
    });
  }));
}

function renderListaTreinoCfg() {
  const el = document.getElementById('listaTreinoCfg');
  el.innerHTML = DIAS_SEMANA_KEY.map((k, idx) => {
    const dia = DB.treino[k];
    let html = `<div class="cfg-dia-bloco"><div class="cfg-dia-titulo"><strong>${DIAS_SEMANA_NOME[idx]} — ${escapeHtml(dia.nome)}</strong>`;
    html += dia.tipo === 'treino' ? `<button class="cfg-item-actions" data-add-ex="${k}" style="background:rgba(120,120,128,.14);border:none;border-radius:10px;padding:8px 10px;font-size:13px;">+ Exercício</button>` : '';
    html += `</div>`;
    if (dia.tipo === 'descanso') {
      html += `<p class="muted small">Dia de descanso ativo.</p>`;
    } else {
      dia.exercicios.forEach(e => {
        html += `
        <div class="cfg-item">
          <div class="cfg-item-info">
            <div class="cfg-item-nome">${escapeHtml(e.nome)}</div>
            <div class="cfg-item-sub">${e.series}x${e.reps}</div>
          </div>
          <div class="cfg-item-actions">
            <button data-edit-ex="${k}|${e.id}">Editar</button>
            <button class="del" data-del-ex="${k}|${e.id}">Excluir</button>
          </div>
        </div>`;
      });
    }
    html += `</div>`;
    return html;
  }).join('');

  el.querySelectorAll('[data-add-ex]').forEach(b => b.addEventListener('click', () => abrirModalExercicio(b.dataset.addEx, null)));
  el.querySelectorAll('[data-edit-ex]').forEach(b => {
    const [k, id] = b.dataset.editEx.split('|');
    b.addEventListener('click', () => abrirModalExercicio(k, id));
  });
  el.querySelectorAll('[data-del-ex]').forEach(b => {
    const [k, id] = b.dataset.delEx.split('|');
    b.addEventListener('click', () => {
      confirmar('Excluir exercício', 'Excluir este exercício do treino?', () => {
        DB.treino[k].exercicios = DB.treino[k].exercicios.filter(e => e.id !== id);
        saveJSON(LS.treino, DB.treino);
        renderListaTreinoCfg();
        showToast('Exercício excluído');
      });
    });
  });
}

function renderListaSuplementosCfg() {
  const el = document.getElementById('listaSuplementosCfg');
  el.innerHTML = DB.suplementos.map(s => `
    <div class="cfg-item">
      <div class="cfg-item-info">
        <div class="cfg-item-nome">${escapeHtml(s.nome)} <span class="muted small">${escapeHtml(s.dose)}</span></div>
        <div class="cfg-item-sub">${escapeHtml(s.momento)}</div>
      </div>
      <div class="cfg-item-actions">
        <button data-edit-sup="${s.id}">Editar</button>
        <button class="del" data-del-sup="${s.id}">Excluir</button>
      </div>
    </div>`).join('');
  el.querySelectorAll('[data-edit-sup]').forEach(b => b.addEventListener('click', () => abrirModalSuplemento(b.dataset.editSup)));
  el.querySelectorAll('[data-del-sup]').forEach(b => b.addEventListener('click', () => {
    confirmar('Excluir suplemento', 'Excluir este suplemento da lista?', () => {
      DB.suplementos = DB.suplementos.filter(s => s.id !== b.dataset.delSup);
      saveJSON(LS.suplementos, DB.suplementos);
      renderListaSuplementosCfg();
      showToast('Suplemento excluído');
    });
  }));
}

/* ===================== MODAL FORM GENÉRICO (refeição / exercício / suplemento) ===================== */
function abrirModalRefeicao(id) {
  const item = id ? DB.dieta.find(r => r.id === id) : null;
  document.getElementById('modalFormTitulo').textContent = item ? 'Editar Refeição' : 'Nova Refeição';
  document.getElementById('modalFormCorpo').innerHTML = `
    <div class="form-grid">
      <div class="field field-wide"><label>Nome</label><input id="mfNome" value="${escapeHtml(item ? item.nome : '')}"></div>
      <div class="field"><label>Horário</label><input id="mfHorario" type="time" value="${item ? item.horario : '12:00'}"></div>
      <div class="field"><label>Calorias (kcal)</label><input id="mfKcal" type="number" value="${item ? item.kcal : ''}"></div>
      <div class="field"><label>Proteína (g)</label><input id="mfProteina" type="number" value="${item ? item.proteina : ''}"></div>
      <div class="field"><label>Carboidratos (g)</label><input id="mfCarbo" type="number" value="${item ? item.carbo : ''}"></div>
      <div class="field"><label>Gorduras (g)</label><input id="mfGordura" type="number" value="${item ? item.gordura : ''}"></div>
      <div class="field field-wide"><label>Itens (um por linha)</label><textarea id="mfItens" rows="4">${item ? escapeHtml(item.itens.join('\n')) : ''}</textarea></div>
    </div>`;
  abrirModalFormComSalvar(() => {
    const nome = document.getElementById('mfNome').value.trim();
    if (!nome) { showToast('Informe o nome da refeição'); return false; }
    const dados = {
      nome,
      horario: document.getElementById('mfHorario').value || '00:00',
      kcal: parseInt(document.getElementById('mfKcal').value, 10) || 0,
      proteina: parseInt(document.getElementById('mfProteina').value, 10) || 0,
      carbo: parseInt(document.getElementById('mfCarbo').value, 10) || 0,
      gordura: parseInt(document.getElementById('mfGordura').value, 10) || 0,
      itens: document.getElementById('mfItens').value.split('\n').map(s => s.trim()).filter(Boolean),
    };
    if (item) {
      Object.assign(item, dados);
    } else {
      DB.dieta.push({ id: uid(), ordem: DB.dieta.length + 1, ...dados });
    }
    saveJSON(LS.dieta, DB.dieta);
    renderListaRefeicoesCfg();
    showToast('Refeição salva');
    return true;
  });
}

function abrirModalExercicio(diaKey, exId) {
  const item = exId ? DB.treino[diaKey].exercicios.find(e => e.id === exId) : null;
  document.getElementById('modalFormTitulo').textContent = item ? 'Editar Exercício' : 'Novo Exercício';
  document.getElementById('modalFormCorpo').innerHTML = `
    <div class="form-grid">
      <div class="field field-wide"><label>Nome</label><input id="mfNome" value="${escapeHtml(item ? item.nome : '')}"></div>
      <div class="field"><label>Séries</label><input id="mfSeries" type="number" value="${item ? item.series : 4}"></div>
      <div class="field"><label>Repetições</label><input id="mfReps" type="number" value="${item ? item.reps : 10}"></div>
    </div>`;
  abrirModalFormComSalvar(() => {
    const nome = document.getElementById('mfNome').value.trim();
    if (!nome) { showToast('Informe o nome do exercício'); return false; }
    const dados = { nome, series: parseInt(document.getElementById('mfSeries').value, 10) || 1, reps: parseInt(document.getElementById('mfReps').value, 10) || 1 };
    if (item) Object.assign(item, dados);
    else DB.treino[diaKey].exercicios.push({ id: uid(), ...dados });
    saveJSON(LS.treino, DB.treino);
    renderListaTreinoCfg();
    showToast('Exercício salvo');
    return true;
  });
}

function abrirModalSuplemento(id) {
  const item = id ? DB.suplementos.find(s => s.id === id) : null;
  document.getElementById('modalFormTitulo').textContent = item ? 'Editar Suplemento' : 'Novo Suplemento';
  document.getElementById('modalFormCorpo').innerHTML = `
    <div class="form-grid">
      <div class="field field-wide"><label>Nome</label><input id="mfNome" value="${escapeHtml(item ? item.nome : '')}"></div>
      <div class="field"><label>Dose</label><input id="mfDose" value="${escapeHtml(item ? item.dose : '')}"></div>
      <div class="field"><label>Momento do dia</label><input id="mfMomento" value="${escapeHtml(item ? item.momento : '')}"></div>
    </div>
    <p class="muted small" style="margin-top:10px;">Este app apenas registra se o suplemento foi tomado ou não. Doses e recomendações devem sempre vir do seu médico ou coach.</p>`;
  abrirModalFormComSalvar(() => {
    const nome = document.getElementById('mfNome').value.trim();
    if (!nome) { showToast('Informe o nome do suplemento'); return false; }
    const dados = { nome, dose: document.getElementById('mfDose').value.trim(), momento: document.getElementById('mfMomento').value.trim() };
    if (item) Object.assign(item, dados);
    else DB.suplementos.push({ id: uid(), ...dados });
    saveJSON(LS.suplementos, DB.suplementos);
    renderListaSuplementosCfg();
    showToast('Suplemento salvo');
    return true;
  });
}

let modalFormOnSalvar = null;
function abrirModalFormComSalvar(onSalvar) {
  modalFormOnSalvar = onSalvar;
  document.getElementById('modalForm').hidden = false;
}
function fecharModalForm() {
  document.getElementById('modalForm').hidden = true;
  modalFormOnSalvar = null;
}

/* ===================== MODAL DE CONFIRMAÇÃO ===================== */
let confirmCallback = null;
function confirmar(titulo, mensagem, callback, pedirTexto) {
  document.getElementById('confirmTitulo').textContent = titulo;
  document.getElementById('confirmMensagem').textContent = mensagem;
  const inputTexto = document.getElementById('confirmInputTexto');
  inputTexto.hidden = !pedirTexto;
  inputTexto.value = '';
  confirmCallback = () => {
    if (pedirTexto && inputTexto.value.trim().toUpperCase() !== pedirTexto.toUpperCase()) {
      showToast(`Digite "${pedirTexto}" para confirmar`);
      return false;
    }
    callback();
    return true;
  };
  document.getElementById('modalConfirm').hidden = false;
}
function fecharConfirm() { document.getElementById('modalConfirm').hidden = true; confirmCallback = null; }

/* ===================== BACKUP / EXPORTAÇÃO ===================== */
function downloadArquivo(conteudo, nomeArquivo, mime) {
  const blob = new Blob([conteudo], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nomeArquivo;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}

function timestampArquivo() {
  const d = new Date();
  const p = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}_${p(d.getHours())}-${p(d.getMinutes())}`;
}

function exportarBackup() {
  const payload = {
    versao: 1,
    exportadoEm: new Date().toISOString(),
    config: DB.config, dieta: DB.dieta, treino: DB.treino, suplementos: DB.suplementos,
    registros: DB.registros, ultimaCarga: DB.ultimaCarga, evolucao: DB.evolucao,
  };
  downloadArquivo(JSON.stringify(payload, null, 2), `backup-shape-de-pai-${timestampArquivo()}.json`, 'application/json');
  DB.backupMeta.ultimoBackup = todayISO();
  saveJSON(LS.backupMeta, DB.backupMeta);
  renderBackupAviso();
  showToast('Backup exportado');
}

function importarBackup(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const dados = JSON.parse(reader.result);
      confirmar('Importar backup', 'Isso vai SUBSTITUIR todos os dados atuais pelos dados do arquivo. Deseja continuar?', () => {
        DB.config = dados.config || seedConfig();
        DB.dieta = dados.dieta || seedDieta();
        DB.treino = dados.treino || seedTreino();
        DB.suplementos = dados.suplementos || seedSuplementos();
        DB.registros = dados.registros || {};
        DB.ultimaCarga = dados.ultimaCarga || {};
        DB.evolucao = dados.evolucao || seedEvolucao();
        persistAll();
        aplicarTema();
        renderAtual();
        showToast('Backup importado com sucesso');
      });
    } catch (e) {
      showToast('Arquivo inválido');
    }
  };
  reader.readAsText(file);
}

function exportarCSV() {
  const linhas = [['Data', 'Dia da Semana', 'Pontuação', 'Faixa', 'Dieta %', 'Treino %', 'Cardio', 'Água (L)', 'Suplementos %'].join(';')];
  Object.keys(DB.registros).sort().forEach(iso => {
    const ad = calcularAderencia(iso);
    const banda = getBanda(ad.score);
    const reg = DB.registros[iso];
    linhas.push([
      formatDataBR(iso), weekdayNome(iso), ad.score, banda.label,
      Math.round(ad.dietaPct), Math.round(ad.treinoPct),
      reg.cardio === 'sim' ? 'Sim' : reg.cardio === 'nao' ? 'Não' : '',
      formatNum(reg.agua / 1000, 2), Math.round(ad.supPct),
    ].join(';'));
  });
  const csv = '﻿' + linhas.join('\r\n');
  downloadArquivo(csv, `historico_shape_de_pai_${timestampArquivo()}.csv`, 'text/csv;charset=utf-8');
  showToast('CSV exportado');
}

/* ===================== TEMA ===================== */
function aplicarTema() {
  const tema = DB.config.tema || 'auto';
  if (tema === 'auto') document.documentElement.removeAttribute('data-theme');
  else document.documentElement.setAttribute('data-theme', tema);
  document.querySelectorAll('#temaSeletor [data-theme]').forEach(b => b.classList.toggle('is-active', b.dataset.theme === tema));
}

/* ===================== BINDINGS GERAIS ===================== */
function bindTabbar() {
  document.querySelectorAll('.tab-item').forEach(btn => {
    btn.addEventListener('click', () => switchView(btn.dataset.view));
  });
}

function bindDateNav() {
  document.getElementById('btnDataAnterior').addEventListener('click', () => { state.viewDate = addDias(state.viewDate, -1); renderHoje(); });
  document.getElementById('btnDataProxima').addEventListener('click', () => { if (state.viewDate < todayISO()) { state.viewDate = addDias(state.viewDate, 1); renderHoje(); } });
  document.getElementById('btnHojeReset').addEventListener('click', () => { state.viewDate = todayISO(); renderHoje(); });

  document.querySelectorAll('[data-datenav]').forEach(btn => {
    btn.addEventListener('click', () => {
      const dir = parseInt(btn.dataset.dir, 10);
      if (dir === 0) state.viewDate = todayISO();
      else if (dir === 1 && state.viewDate >= todayISO()) return;
      else state.viewDate = addDias(state.viewDate, dir);
      renderAtual();
    });
  });
}

function bindAgua() {
  document.querySelectorAll('[data-agua]').forEach(btn => {
    btn.addEventListener('click', () => {
      const ml = parseInt(btn.dataset.agua, 10);
      const r = getRegistro(state.viewDate);
      r.agua += ml;
      r.aguaHistorico.push(ml);
      saveRegistro(state.viewDate);
      renderHoje();
      showToast(`+${ml}ml de água`);
    });
  });
  document.getElementById('btnAguaDesfazer').addEventListener('click', () => {
    const r = getRegistro(state.viewDate);
    const ultimo = r.aguaHistorico.pop();
    if (ultimo) {
      r.agua = Math.max(0, r.agua - ultimo);
      saveRegistro(state.viewDate);
      renderHoje();
    }
  });
}

function bindCardio() {
  document.getElementById('btnCardioSim').addEventListener('click', () => setCardio('sim'));
  document.getElementById('btnCardioNao').addEventListener('click', () => setCardio('nao'));
}
function setCardio(valor) {
  const r = getRegistro(state.viewDate);
  r.cardio = r.cardio === valor ? null : valor;
  saveRegistro(state.viewDate);
  renderHoje();
}

function bindCalendarioNav() {
  document.getElementById('btnMesAnterior').addEventListener('click', () => {
    state.calMes = new Date(state.calMes.getFullYear(), state.calMes.getMonth() - 1, 1);
    renderHistorico();
  });
  document.getElementById('btnMesProximo').addEventListener('click', () => {
    state.calMes = new Date(state.calMes.getFullYear(), state.calMes.getMonth() + 1, 1);
    renderHistorico();
  });
}

function bindConfigForms() {
  document.getElementById('formPerfil').addEventListener('submit', (e) => {
    e.preventDefault();
    DB.config.nome = document.getElementById('cfgNome').value.trim() || 'Você';
    DB.config.altura = parseNum(document.getElementById('cfgAltura').value);
    DB.config.pesoRef = parseNum(document.getElementById('cfgPeso').value);
    DB.config.metaAgua = parseNum(document.getElementById('cfgMetaAgua').value) || 5;
    saveJSON(LS.config, DB.config);
    showToast('Dados salvos');
    if (state.view === 'hoje') renderHoje();
  });

  document.querySelectorAll('#temaSeletor [data-theme]').forEach(b => {
    b.addEventListener('click', () => {
      DB.config.tema = b.dataset.theme;
      saveJSON(LS.config, DB.config);
      aplicarTema();
    });
  });

  document.getElementById('btnTema').addEventListener('click', () => {
    const atualEscuro = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const efetivo = DB.config.tema === 'auto' ? (atualEscuro ? 'dark' : 'light') : DB.config.tema;
    DB.config.tema = efetivo === 'dark' ? 'light' : 'dark';
    saveJSON(LS.config, DB.config);
    aplicarTema();
  });

  document.getElementById('btnAddRefeicao').addEventListener('click', () => abrirModalRefeicao(null));
  document.getElementById('btnAddSuplemento').addEventListener('click', () => abrirModalSuplemento(null));

  document.getElementById('btnExportarBackup').addEventListener('click', exportarBackup);
  document.getElementById('btnExportarCSV').addEventListener('click', exportarCSV);
  document.getElementById('btnImportarBackup').addEventListener('click', () => document.getElementById('inputImportarBackup').click());
  document.getElementById('inputImportarBackup').addEventListener('change', (e) => {
    if (e.target.files[0]) importarBackup(e.target.files[0]);
    e.target.value = '';
  });

  document.getElementById('btnApagarTudo').addEventListener('click', () => {
    confirmar('Apagar todos os dados', 'Esta ação é IRREVERSÍVEL e vai apagar todo o histórico, evolução e configurações. Digite APAGAR para confirmar.', () => {
      localStorage.clear();
      DB = {};
      initData();
      state.viewDate = todayISO();
      aplicarTema();
      switchView('hoje');
      showToast('Todos os dados foram apagados');
    }, 'APAGAR');
  });
}

function bindModais() {
  document.getElementById('confirmCancelar').addEventListener('click', fecharConfirm);
  document.getElementById('confirmOk').addEventListener('click', () => {
    const podeFechar = confirmCallback ? confirmCallback() : true;
    if (podeFechar !== false) fecharConfirm();
  });
  document.getElementById('modalConfirm').addEventListener('click', (e) => { if (e.target.id === 'modalConfirm') fecharConfirm(); });

  document.getElementById('btnFecharModalForm').addEventListener('click', fecharModalForm);
  document.getElementById('btnModalFormCancelar').addEventListener('click', fecharModalForm);
  document.getElementById('btnModalFormSalvar').addEventListener('click', () => {
    if (modalFormOnSalvar && modalFormOnSalvar() !== false) fecharModalForm();
  });
  document.getElementById('modalForm').addEventListener('click', (e) => { if (e.target.id === 'modalForm') fecharModalForm(); });
}

/* ===================== INICIALIZAÇÃO ===================== */
function init() {
  initData();
  aplicarTema();
  bindTabbar();
  bindDateNav();
  bindAgua();
  bindCardio();
  bindCalendarioNav();
  bindConfigForms();
  bindModais();
  bindFormEvolucao();
  switchView('hoje');

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('service-worker.js').catch(() => {});
    });
  }
}

document.addEventListener('DOMContentLoaded', init);
