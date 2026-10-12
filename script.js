const STORAGE_KEY = "todos";

const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const list = document.getElementById("task-list");
const emptyMessage = document.getElementById("empty-message");

let tasks = loadTasks();
render();

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const text = input.value.trim();
  if (!text) {
    return;
  }

  tasks.push({
    id: Date.now(),
    text: text,
    completed: false
  });

  input.value = "";
  saveTasks();
  render();
});

list.addEventListener("change", function (event) {
  if (event.target.type !== "checkbox") {
    return;
  }

  const item = event.target.closest("li");
  const id = Number(item.dataset.id);
  const task = tasks.find(function (task) {
    return task.id === id;
  });

  if (!task) {
    return;
  }

  task.completed = event.target.checked;
  item.classList.toggle("completed", task.completed);
  saveTasks();
});

list.addEventListener("click", function (event) {
  if (!event.target.classList.contains("delete")) {
    return;
  }

  const item = event.target.closest("li");
  const id = Number(item.dataset.id);

  tasks = tasks.filter(function (task) {
    return task.id !== id;
  });
  saveTasks();
  render();
});

function loadTasks() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    return [];
  }

  try {
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed;
  } catch (error) {
    return [];
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function render() {
  list.innerHTML = "";
  emptyMessage.hidden = tasks.length > 0;

  tasks.forEach(function (task) {
    const item = document.createElement("li");
    item.dataset.id = String(task.id);
    if (task.completed) {
      item.classList.add("completed");
    }

    const label = document.createElement("label");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;

    const text = document.createElement("span");
    text.textContent = task.text;

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete";
    deleteButton.textContent = "Delete";

    label.append(checkbox, text);
    item.append(label, deleteButton);
    list.append(item);
  });
}
