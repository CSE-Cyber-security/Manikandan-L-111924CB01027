
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const emptyMessage = document.getElementById("empty-message");
const pendingCount = document.getElementById("pending-count");
const completedCount = document.getElementById("completed-count");
const filterButtons = document.querySelectorAll(".filter");

let tasks = [];

try {
  const savedTasks = JSON.parse(localStorage.getItem("todoTasks"));
  if (Array.isArray(savedTasks)) {
    tasks = savedTasks.filter(task =>
      task &&
      typeof task.id === "string" &&
      typeof task.text === "string" &&
      typeof task.completed === "boolean"
    );
  }
} catch {
  tasks = [];
}

let currentFilter = "all";

function saveTasks() {
  localStorage.setItem("todoTasks", JSON.stringify(tasks));
}

function renderTasks() {
  taskList.replaceChildren();

  const filteredTasks = tasks.filter(task => {
    if (currentFilter === "pending") return !task.completed;
    if (currentFilter === "completed") return task.completed;
    return true;
  });

  const pending = tasks.filter(task => !task.completed).length;
  const completed = tasks.filter(task => task.completed).length;

  pendingCount.textContent = `${pending} pending`;
  completedCount.textContent = `${completed} completed`;

  emptyMessage.hidden = filteredTasks.length > 0;

  if (tasks.length === 0) {
    emptyMessage.textContent = "No tasks yet. Add your first task!";
  } else if (filteredTasks.length === 0) {
    emptyMessage.textContent = "No tasks in this category.";
  }

  filteredTasks.forEach(task => {
    const item = document.createElement("li");
    item.className = "task-item";

    if (task.completed) item.classList.add("completed");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", `Complete ${task.text}`);

    checkbox.addEventListener("change", () => toggleTask(task.id));

    const text = document.createElement("span");
    text.className = "task-text";
    text.textContent = task.text;

    const actions = document.createElement("div");
    actions.className = "task-actions";

    const completeButton = document.createElement("button");
    completeButton.type = "button";
    completeButton.className = "action-btn complete-btn";
    completeButton.textContent = "✓";
    completeButton.title = task.completed
      ? "Mark as pending"
      : "Mark as completed";

    completeButton.addEventListener("click", () => toggleTask(task.id));

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "action-btn delete-btn";
    deleteButton.textContent = "🗑";
    deleteButton.title = "Delete task";

    deleteButton.addEventListener("click", () => deleteTask(task.id));

    actions.append(completeButton, deleteButton);
    item.append(checkbox, text, actions);
    taskList.appendChild(item);
  });
}

function addTask(text) {
  tasks.unshift({
    id: crypto.randomUUID(),
    text: text,
    completed: false
  });

  saveTasks();
  renderTasks();
}

function toggleTask(id) {
  tasks = tasks.map(task =>
    task.id === id
      ? { ...task, completed: !task.completed }
      : task
  );

  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
}

taskForm.addEventListener("submit", event => {
  event.preventDefault();

  const text = taskInput.value.trim();
  if (!text) return;

  addTask(text);
  taskInput.value = "";
  taskInput.focus();
});

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;

    filterButtons.forEach(filter => {
      const active = filter === button;
      filter.classList.toggle("active", active);
      filter.setAttribute("aria-pressed", String(active));
    });

    renderTasks();
  });
});

renderTasks();
