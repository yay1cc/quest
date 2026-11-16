const $ = (id) => document.getElementById(id);
let games = [];
let tasks = [];

function renderGames() {
  const query = $('search-input').value.trim().toLocaleLowerCase('tr-TR');
  const filtered = games.filter((game) => (game.name + ' ' + game.store).toLocaleLowerCase('tr-TR').includes(query));
  $('game-grid').innerHTML = '';
  if (!filtered.length) {
    $('game-grid').innerHTML = '<div class="empty">Aramana uygun oyun bulunamadı.</div>';
    return;
  }
  filtered.forEach((game) => {
    const card = document.createElement('article');
    card.className = 'game-card';
    const top = document.createElement('div');
    top.className = 'game-top';
    const symbol = document.createElement('div');
    symbol.className = 'game-symbol';
    symbol.textContent = '🎮';
    const status = document.createElement('span');
    status.className = 'status';
    const dot = document.createElement('i');
    dot.className = 'dot' + (game.running ? ' running' : '');
    status.append(dot, document.createTextNode(game.running ? 'Çalışıyor' : 'Çalışmıyor'));
    top.append(symbol, status);
    const title = document.createElement('h4');
    title.textContent = game.name;
    const store = document.createElement('div');
    store.className = 'store';
    store.textContent = game.store;
    card.append(top, title, store);

    if (game.installTracked) {
      const install = document.createElement('div');
      install.className = 'install-status' + (game.installed ? ' installed' : '');
      install.textContent = game.installed ? '✓ Bilgisayarda kurulu' : 'Kurulu olarak bulunamadı';
      card.append(install);
    }
    $('game-grid').append(card);
  });
}

async function refreshGames() {
  $('game-grid').innerHTML = '<div class="empty">Oyunlar taranıyor...</div>';
  try {
    games = await window.questHub.listGames();
    renderGames();
  } catch {
    $('game-grid').innerHTML = '<div class="empty">Oyun listesi alınamadı.</div>';
  }
}

function renderTasks() {
  const list = $('task-list');
  list.innerHTML = '';
  if (!tasks.length) {
    list.innerHTML = '<div class="empty">Henüz görev eklemedin.</div>';
    return;
  }
  tasks.forEach((task, index) => {
    const row = document.createElement('label');
    row.className = 'task' + (task.done ? ' done' : '');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.done;
    checkbox.addEventListener('change', () => {
      tasks[index].done = checkbox.checked;
      renderTasks();
    });
    const name = document.createElement('span');
    name.textContent = task.name;
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.textContent = 'Sil';
    remove.addEventListener('click', (event) => {
      event.preventDefault();
      tasks.splice(index, 1);
      renderTasks();
    });
    row.append(checkbox, name, remove);
    list.append(row);
  });
}

$('enter-button').addEventListener('click', () => $('welcome').classList.add('hidden'));
$('refresh-button').addEventListener('click', refreshGames);
$('search-input').addEventListener('input', () => {
  if (!$('quests-view').classList.contains('hidden')) {
    const query = $('search-input').value.trim().toLocaleLowerCase('tr-TR');
    document.querySelectorAll('.task').forEach((row) => {
      row.style.display = row.textContent.toLocaleLowerCase('tr-TR').includes(query) ? '' : 'none';
    });
  } else renderGames();
});
$('add-task').addEventListener('click', () => {
  const name = $('task-input').value.trim();
  if (!name) return;
  tasks.push({ name, done: false });
  $('task-input').value = '';
  renderTasks();
});
$('task-input').addEventListener('keydown', (event) => {
  if (event.key === 'Enter') $('add-task').click();
});

document.querySelectorAll('.nav-item').forEach((button) => {
  button.addEventListener('click', () => {
    const view = button.dataset.view;
    document.querySelectorAll('.nav-item').forEach((item) => item.classList.toggle('active', item === button));
    document.querySelectorAll('.view').forEach((item) => item.classList.add('hidden'));
    $(view + '-view').classList.remove('hidden');
    $('page-title').textContent = view === 'games' ? 'Oyunlar' : view === 'quests' ? 'Görev takibi' : 'Hakkında';
    $('search-input').placeholder = view === 'quests' ? 'Görev ara...' : 'Oyun veya görev ara...';
    $('search-input').value = '';
    if (view === 'games') renderGames();
    if (view === 'quests') renderTasks();
  });
});

refreshGames();
