const STORAGE_KEY = 'tao-i-progress-v1';
const CHAPTERS = [
  { id: 'fundamentos', title: '1. Fundamentos e presença', description: 'Comece com unidade, atenção e presença humana.', entries: ['yi', 'ren'] },
  { id: 'coracao', title: '2. Coração e quietude', description: 'Pratique intenção, serenidade e escuta interior.', entries: ['xin', 'jing'] },
  { id: 'natureza', title: '3. Natureza e energia', description: 'Explore a relação entre sopro, céu e sustentação.', entries: ['qi', 'tian', 'di'] },
  { id: 'harmonia', title: '4. Harmonia e observação', description: 'Estude equilíbrio, contemplação e conhecimento.', entries: ['he', 'guan', 'zhi'] },
  { id: 'caminho', title: '5. Ação e caminho', description: 'Leve a atenção para o movimento, o desapego e a prática.', entries: ['xing', 'wu', 'dao'] }
];
let entries = [];
let activeFilter = 'all';
let activeChapter = 'all';
let selectedId = null;
let revealedStrokeCount = 0;
let progress = loadProgress();

const list = document.querySelector('#character-list');
const detail = document.querySelector('#detail');
const searchInput = document.querySelector('#search');
const emptyState = document.querySelector('#empty-state');
const resultCount = document.querySelector('#result-count');
const chapterSelect = document.querySelector('#chapter-select');

function loadProgress() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
  catch { return {}; }
}
function saveProgress() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); }
  catch { /* App remains usable if storage is unavailable. */ }
}
function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}
function chapterFor(id) { return CHAPTERS.find((chapter) => chapter.entries.includes(id)); }
function setupChapters() {
  CHAPTERS.forEach((chapter) => chapterSelect.append(new Option(chapter.title, chapter.id)));
  chapterSelect.addEventListener('change', () => {
    activeChapter = chapterSelect.value;
    updateChapterDescription();
    renderList();
  });
  updateChapterDescription();
}
function updateChapterDescription() {
  const chapter = CHAPTERS.find((item) => item.id === activeChapter);
  document.querySelector('#chapter-description').textContent = chapter ? chapter.description : 'Escolha uma unidade temática ou veja todos os caracteres.';
}
function filteredEntries() {
  const query = searchInput.value.trim().toLocaleLowerCase('pt-BR');
  return entries.filter((entry) => {
    const matchesText = [entry.character, entry.pinyin, entry.meaning, entry.individualMeaning, entry.category]
      .some((value) => String(value || '').toLocaleLowerCase('pt-BR').includes(query));
    const chapter = chapterFor(entry.id);
    const matchesChapter = activeChapter === 'all' || chapter?.id === activeChapter;
    const learned = Boolean(progress[entry.id]);
    const matchesFilter = activeFilter === 'all' || (activeFilter === 'learned' ? learned : !learned);
    return matchesText && matchesChapter && matchesFilter;
  });
}
function updateProgress() {
  const studied = entries.filter((entry) => Boolean(progress[entry.id])).length;
  const percent = entries.length ? Math.round((studied / entries.length) * 100) : 0;
  document.querySelector('#progress-count').textContent = `${studied} de ${entries.length} ideogramas estudados`;
  document.querySelector('#progress-label').textContent = studied === entries.length && entries.length ? 'Parabéns, você concluiu esta etapa!' : studied ? 'Sua prática está avançando' : 'Sua jornada começa aqui';
  document.querySelector('#progress-fill').style.width = `${percent}%`;
  document.querySelector('.progress-track').setAttribute('aria-valuenow', String(percent));
}
function renderList() {
  const filtered = filteredEntries();
  list.replaceChildren();
  resultCount.textContent = `${filtered.length} ${filtered.length === 1 ? 'item' : 'itens'}`;
  emptyState.hidden = filtered.length !== 0;
  filtered.forEach((entry) => {
    const button = element('button', `character-item${selectedId === entry.id ? ' selected' : ''}`);
    button.type = 'button';
    button.setAttribute('aria-pressed', String(selectedId === entry.id));
    const glyph = element('span', 'list-glyph', entry.character);
    const info = element('span', 'list-info');
    info.append(element('strong', '', entry.meaning), element('small', '', `${entry.pinyin} · ${entry.strokeCount} ${entry.strokeCount === 1 ? 'traço' : 'traços'}`));
    button.append(glyph, info);
    if (progress[entry.id]) button.append(element('span', 'learned-mark', '✓'));
    button.addEventListener('click', () => selectEntry(entry.id));
    list.append(button);
  });
  if (filtered.length) {
    let selected = filtered.find((entry) => entry.id === selectedId);
    if (!selected) { selected = filtered[0]; selectedId = selected.id; revealedStrokeCount = 0; }
    renderDetail(selected, filtered);
  } else {
    selectedId = null;
    detail.innerHTML = '<div class="detail-placeholder"><span class="placeholder-mark" aria-hidden="true">文</span><h2>Nenhum item encontrado</h2><p>Altere a busca ou os filtros para continuar.</p></div>';
  }
  updateProgress();
}
function selectEntry(id) {
  selectedId = id;
  revealedStrokeCount = 0;
  renderList();
  if (window.matchMedia('(max-width: 760px)').matches) detail.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
function renderDetail(entry, visibleEntries) {
  detail.replaceChildren();
  const chapter = chapterFor(entry.id);
  const header = element('div', 'detail-header');
  const glyph = element('div', 'detail-glyph', entry.character);
  glyph.setAttribute('aria-label', `${entry.character}, ${entry.meaning}`);
  const title = element('div', 'detail-title');
  title.append(element('p', 'eyebrow', chapter?.title || entry.category), element('h2', '', entry.meaning), element('p', 'pinyin', entry.pinyin));
  header.append(glyph, title);
  detail.append(header);

  detail.append(section('Significado individual', entry.individualMeaning));
  const strokes = element('section', 'detail-section');
  const strokeHeading = element('div', 'section-heading');
  strokeHeading.append(element('h3', '', `Ordem dos traços · ${entry.strokeCount}`), element('span', 'stroke-counter', `${Math.min(revealedStrokeCount, entry.strokes.length)} / ${entry.strokes.length}`));
  strokes.append(strokeHeading);
  const strokeList = element('ol', 'stroke-list');
  entry.strokes.forEach((stroke, index) => {
    const item = element('li', index < revealedStrokeCount ? 'stroke-visible' : 'stroke-hidden', stroke);
    if (index >= revealedStrokeCount) item.setAttribute('aria-label', `Traço ${index + 1}, ainda não revelado`);
    strokeList.append(item);
  });
  strokes.append(strokeList);
  const strokeButton = element('button', 'text-button', revealedStrokeCount >= entry.strokes.length ? 'Mostrar todos os traços novamente' : 'Mostrar próximo traço');
  strokeButton.type = 'button';
  strokeButton.addEventListener('click', () => {
    revealedStrokeCount = revealedStrokeCount >= entry.strokes.length ? 1 : revealedStrokeCount + 1;
    renderList();
  });
  strokes.append(strokeButton);
  detail.append(strokes);

  const practice = element('section', 'practice-box');
  practice.append(element('h3', '', 'Frase de estudo'), element('p', 'phrase', `“${entry.phrase}”`), element('p', 'translation', entry.translation));
  detail.append(practice);
  detail.append(section('Exercício', entry.exercise));
  const steps = element('section', 'detail-section');
  steps.append(element('h3', '', 'Passo a passo'));
  const stepList = element('ol', 'step-list');
  entry.steps.forEach((step) => stepList.append(element('li', '', step)));
  steps.append(stepList);
  detail.append(steps);

  const footer = element('div', 'detail-actions');
  const learned = element('button', `learned-button${progress[entry.id] ? ' is-learned' : ''}`, progress[entry.id] ? '✓  Estudado — marcar para revisar' : 'Marcar como estudado');
  learned.type = 'button';
  learned.addEventListener('click', () => {
    if (progress[entry.id]) delete progress[entry.id];
    else progress[entry.id] = true;
    saveProgress();
    renderList();
  });
  const nav = element('div', 'entry-navigation');
  const index = visibleEntries.findIndex((item) => item.id === entry.id);
  const previous = element('button', 'nav-button', '← Anterior');
  previous.type = 'button';
  previous.disabled = index <= 0;
  previous.addEventListener('click', () => selectEntry(visibleEntries[index - 1].id));
  const next = element('button', 'nav-button', 'Próximo →');
  next.type = 'button';
  next.disabled = index >= visibleEntries.length - 1;
  next.addEventListener('click', () => selectEntry(visibleEntries[index + 1].id));
  nav.append(previous, next);
  footer.append(learned, nav);
  detail.append(footer);
}
function section(title, text) {
  const block = element('section', 'detail-section');
  block.append(element('h3', '', title), element('p', '', text));
  return block;
}

searchInput.addEventListener('input', renderList);
document.querySelectorAll('.filter').forEach((button) => {
  button.addEventListener('click', () => {
    activeFilter = button.dataset.filter;
    document.querySelectorAll('.filter').forEach((item) => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    renderList();
  });
});
document.querySelector('#review-button').addEventListener('click', () => {
  if (!entries.length) return;
  const unstudied = entries.filter((entry) => !progress[entry.id]);
  const pool = unstudied.length ? unstudied : entries;
  const entry = pool[Math.floor(Math.random() * pool.length)];
  activeChapter = 'all';
  activeFilter = 'all';
  chapterSelect.value = 'all';
  document.querySelectorAll('.filter').forEach((button) => {
    const active = button.dataset.filter === 'all';
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  searchInput.value = '';
  updateChapterDescription();
  selectEntry(entry.id);
});

fetch('data/ideogramas.json')
  .then((response) => { if (!response.ok) throw new Error('Não foi possível carregar os dados.'); return response.json(); })
  .then((data) => {
    entries = data;
    setupChapters();
    renderList();
  })
  .catch(() => {
    list.replaceChildren(element('p', 'empty-state', 'Não foi possível carregar os ideogramas. Recarregue o app quando estiver conectado.'));
  });

let installPrompt;
const installButton = document.querySelector('#install-button');
window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  installPrompt = event;
  installButton.hidden = false;
});
installButton.addEventListener('click', async () => {
  if (!installPrompt) return;
  installPrompt.prompt();
  await installPrompt.userChoice;
  installPrompt = null;
  installButton.hidden = true;
});
if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
const offlineStatus = document.querySelector('#offline-status');
function updateConnectionStatus() { offlineStatus.textContent = navigator.onLine ? '' : 'Offline'; }
window.addEventListener('online', updateConnectionStatus);
window.addEventListener('offline', updateConnectionStatus);
updateConnectionStatus();
