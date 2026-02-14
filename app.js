const STORAGE_KEY = 'wang-ji-todos-v1';
const SETTINGS_KEY = 'wang-ji-settings-v1';

const form = document.querySelector('#todo-form');
const input = document.querySelector('#todo-input');
const list = document.querySelector('#todo-list');
const stats = document.querySelector('#task-stats');
const emptyState = document.querySelector('#empty-state');
const itemTemplate = document.querySelector('#todo-item-template');
const settingsToggle = document.querySelector('#settings-toggle');
const settingsPanel = document.querySelector('#settings-panel');
const themeSelect = document.querySelector('#theme-select');
const customColor = document.querySelector('#custom-color');
const customColorLabel = document.querySelector('#custom-color-label');
const bgUpload = document.querySelector('#bg-upload');
const clearBg = document.querySelector('#clear-bg');

let todos = loadTodos();
let settings = loadSettings();

applySettings();
render();

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const text = input.value.trim();

  if (!text) {
    return;
  }

  const item = {
    id: crypto.randomUUID(),
    text,
    completed: false,
  };

  todos.unshift(item);
  persistTodos();
  render();
  form.reset();
  input.focus();
});

list.addEventListener('click', (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const item = target.closest('.todo-item');
  if (!item) {
    return;
  }

  const id = item.dataset.id;
  if (!id) {
    return;
  }

  if (target.matches('.delete-btn')) {
    todos = todos.filter((todo) => todo.id !== id);
    persistTodos();
    render();
  }
});

list.addEventListener('change', (event) => {
  const target = event.target;
  if (!(target instanceof HTMLInputElement)) {
    return;
  }

  if (target.type !== 'checkbox') {
    return;
  }

  const item = target.closest('.todo-item');
  if (!item) {
    return;
  }

  const id = item.dataset.id;
  const todo = todos.find((entry) => entry.id === id);
  if (!todo) {
    return;
  }

  todo.completed = target.checked;
  persistTodos();
  render();
});

settingsToggle.addEventListener('click', () => {
  const nextState = settingsPanel.hidden;
  settingsPanel.hidden = !nextState;
  settingsToggle.setAttribute('aria-expanded', String(nextState));
});

document.addEventListener('click', (event) => {
  const target = event.target;
  if (!(target instanceof Node)) {
    return;
  }

  if (!settingsPanel.hidden && !settingsPanel.contains(target) && !settingsToggle.contains(target)) {
    closeSettingsPanel();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeSettingsPanel();
  }
});

themeSelect.addEventListener('change', () => {
  settings.theme = themeSelect.value;
  persistSettings();
  applySettings();
});

customColor.addEventListener('input', () => {
  settings.customColor = customColor.value;
  persistSettings();
  if (settings.theme === 'custom') {
    applySettings();
  }
});

bgUpload.addEventListener('change', async () => {
  const file = bgUpload.files && bgUpload.files[0];
  if (!file) {
    return;
  }

  const isValidType = ['image/png', 'image/jpeg', 'image/svg+xml'].includes(file.type);
  if (!isValidType) {
    return;
  }

  settings.backgroundImage = await fileToDataUrl(file);
  persistSettings();
  applySettings();
  bgUpload.value = '';
});

clearBg.addEventListener('click', () => {
  settings.backgroundImage = '';
  persistSettings();
  applySettings();
});

function render() {
  list.innerHTML = '';

  todos.forEach((todo) => {
    const fragment = itemTemplate.content.cloneNode(true);
    const item = fragment.querySelector('.todo-item');
    const checkbox = fragment.querySelector('input[type="checkbox"]');
    const text = fragment.querySelector('.todo-text');

    item.dataset.id = todo.id;
    item.classList.toggle('completed', todo.completed);
    checkbox.checked = todo.completed;
    text.textContent = todo.text;

    list.append(fragment);
  });

  const remaining = todos.filter((todo) => !todo.completed).length;
  stats.textContent = `${remaining} remaining`;
  emptyState.hidden = todos.length > 0;
}

function persistTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function closeSettingsPanel() {
  settingsPanel.hidden = true;
  settingsToggle.setAttribute('aria-expanded', 'false');
}

function applySettings() {
  const resolvedTheme = getTheme(settings.theme);
  themeSelect.value = resolvedTheme;
  customColor.value = settings.customColor;

  const showCustom = resolvedTheme === 'custom';
  customColor.hidden = !showCustom;
  customColorLabel.hidden = !showCustom;

  if (resolvedTheme === 'custom') {
    document.body.removeAttribute('data-theme');
    const palette = createPalette(settings.customColor);
    applyCustomPalette(palette);
  } else {
    clearCustomPalette();
    document.body.dataset.theme = resolvedTheme;
  }

  if (settings.backgroundImage) {
    document.body.classList.add('has-image');
    document.body.style.setProperty('--bg-image', `url('${settings.backgroundImage}')`);
  } else {
    document.body.classList.remove('has-image');
    document.body.style.removeProperty('--bg-image');
  }
}

function applyCustomPalette(palette) {
  const root = document.documentElement.style;
  root.setProperty('--bg-gradient-a', palette.bgA);
  root.setProperty('--bg-gradient-b', palette.bgB);
  root.setProperty('--panel', palette.panel);
  root.setProperty('--panel-border', palette.border);
  root.setProperty('--text', palette.text);
  root.setProperty('--muted', palette.muted);
  root.setProperty('--accent', palette.accent);
  root.setProperty('--accent-strong', palette.accentStrong);
  root.setProperty('--danger', palette.danger);
}

function clearCustomPalette() {
  const root = document.documentElement.style;
  root.removeProperty('--bg-gradient-a');
  root.removeProperty('--bg-gradient-b');
  root.removeProperty('--panel');
  root.removeProperty('--panel-border');
  root.removeProperty('--text');
  root.removeProperty('--muted');
  root.removeProperty('--accent');
  root.removeProperty('--accent-strong');
  root.removeProperty('--danger');
}

function createPalette(hexColor) {
  const safeColor = /^#[0-9a-fA-F]{6}$/.test(hexColor) ? hexColor : '#1769aa';
  const rgb = hexToRgb(safeColor);
  const muted = mixColor(rgb, { r: 255, g: 255, b: 255 }, 0.42);
  return {
    bgA: rgbToHex(mixColor(rgb, { r: 255, g: 255, b: 255 }, 0.9)),
    bgB: rgbToHex(mixColor(rgb, { r: 244, g: 236, b: 255 }, 0.82)),
    panel: rgbToHex(mixColor(rgb, { r: 255, g: 255, b: 255 }, 0.94)),
    border: rgbToHex(mixColor(rgb, { r: 222, g: 227, b: 236 }, 0.7)),
    text: '#1c2630',
    muted: rgbToHex(muted),
    accent: safeColor,
    accentStrong: rgbToHex(mixColor(rgb, { r: 20, g: 33, b: 51 }, 0.25)),
    danger: '#b61e3b',
  };
}

function hexToRgb(hex) {
  const clean = hex.slice(1);
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  };
}

function rgbToHex({ r, g, b }) {
  const toHex = (value) => value.toString(16).padStart(2, '0');
  return `#${toHex(clampColor(r))}${toHex(clampColor(g))}${toHex(clampColor(b))}`;
}

function mixColor(start, end, amount) {
  return {
    r: Math.round(start.r + (end.r - start.r) * amount),
    g: Math.round(start.g + (end.g - start.g) * amount),
    b: Math.round(start.b + (end.b - start.b) * amount),
  };
}

function clampColor(value) {
  return Math.max(0, Math.min(255, value));
}

function getTheme(theme) {
  const allowed = ['light', 'dark', 'google', 'neon', 'pastel', 'custom'];
  return allowed.includes(theme) ? theme : 'light';
}

function persistSettings() {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

function loadSettings() {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (!saved) {
      return {
        theme: 'light',
        customColor: '#1769aa',
        backgroundImage: '',
      };
    }

    const parsed = JSON.parse(saved);
    const theme = typeof parsed.theme === 'string' ? parsed.theme : 'light';
    const custom = typeof parsed.customColor === 'string' ? parsed.customColor : '#1769aa';
    const backgroundImage = typeof parsed.backgroundImage === 'string' ? parsed.backgroundImage : '';

    return {
      theme: getTheme(theme),
      customColor: /^#[0-9a-fA-F]{6}$/.test(custom) ? custom : '#1769aa',
      backgroundImage,
    };
  } catch (error) {
    console.error('Failed to load settings from storage', error);
    return {
      theme: 'light',
      customColor: '#1769aa',
      backgroundImage: '',
    };
  }
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
        return;
      }
      reject(new Error('Invalid image data'));
    };
    reader.onerror = () => reject(reader.error || new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

function loadTodos() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      return [];
    }

    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((item) => {
      return (
        item &&
        typeof item.id === 'string' &&
        typeof item.text === 'string' &&
        typeof item.completed === 'boolean'
      );
    });
  } catch (error) {
    console.error('Failed to load todos from storage', error);
    return [];
  }
}
