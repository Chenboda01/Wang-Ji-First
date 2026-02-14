const STORAGE_KEY = 'wang-ji-todos-v1';

const form = document.querySelector('#todo-form');
const input = document.querySelector('#todo-input');
const list = document.querySelector('#todo-list');
const stats = document.querySelector('#task-stats');
const emptyState = document.querySelector('#empty-state');
const itemTemplate = document.querySelector('#todo-item-template');

let todos = loadTodos();

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
