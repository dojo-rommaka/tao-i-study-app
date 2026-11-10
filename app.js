const STORAGE_KEY = 'tao-i-progress-v1';
let entries = [];
let activeFilter = 'all';
let selectedId = null;
let progress = loadProgress();

const list = document.querySelector('#character-list');
const detail = document.querySelector('#detail');
const searchInput = document.querySelector('#search');
const emptyState = document.querySelector('#empty-state');
const resultCount = document.querySelector('#result-count');

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
function filteredEntries() {
  const query = searchInput.value.trim().toLocaleLowerCase('pt-BR');
  return entries.filter((entry) => {
    const matchesText = [entry.character, entry.pinyin, entry.meaning, entry.individualMeaning, entry.category]
      .some((value) => value.toLocaleLowerCase('pt-BR').includes(query));
    const learned = Boolean(progress[entry.id]);
    const matchesFilter = activeFilter === 'all' || (activeFilter === 'learned' ? learned : !learned);
    return matchesText && matchesFilter;
  });
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
}
function selectEntry(id) {
  selectedId = id;
  const entry = entries.find((item) => item.id === id);
  if (!entry) return;
  renderList();
  renderDetail(entry);
}
function renderDetail(entry) {
  detail.replaceChildren();
  const header = element('div', 'detail-header');
  const glyph = element('div', 'detail-glyph', entry.character);
  glyph.setAttribute('aria-label', `${entry.character}, ${entry.meaning}`);
  const title = element('div', 'detail-title');
  title.append(element('p', 'eyebrow', entry.category), element('h2', '', entry.meaning), element('p', 'pinyin', entry.pinyin));
  header.append(glyph, title);
  detail.append(header);

  detail.append(section('Significado individual', entry.individualMeaning));
  const strokes = element('section', 'detail-section');
  strokes.append(element('h3', '', `Ordem dos traços · ${entry.strokeCount}`));
  const strokeList = element('ol', 'stroke-list');
  entry.strokes.forEach((stroke) => strokeList.append(element('li', '', stroke)));
  strokes.append(strokeList);
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

  const toggle = element('button', `learned-button${progress[entry.id] ? ' is-learned' : ''}`, progress[entry.id] ? '✓  Estudado — marcar para revisar' : 'Marcar como estudado');
  toggle.type = 'button';
  toggle.addEventListener('click', () => {
    if (progress[entry.id]) delete progress[entry.id];
    else progress[entry.id] = true;
    saveProgress();
    renderList();
    renderDetail(entry);
  });
  detail.append(toggle);
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
    document.querySelectorAll('.filter').forEach((item) => item.classList.toggle('active', item === button));
    renderList();
  });
});

fetch('data/ideogramas.json')
  .then((response) => { if (!response.ok) throw new Error('Não foi possível carregar os dados.'); return response.json(); })
  .then((data) => {
    entries = data;
    renderList();
    if (entries.length) selectEntry(entries[0].id);
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

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
}
const offlineStatus = document.querySelector('#offline-status');
function updateConnectionStatus() { offlineStatus.textContent = navigator.onLine ? '' : 'Offline'; }
window.addEventListener('online', updateConnectionStatus);
window.addEventListener('offline', updateConnectionStatus);
updateConnectionStatus();
