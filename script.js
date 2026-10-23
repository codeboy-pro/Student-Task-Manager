// ===== Student Task Manager =====
// All tasks are stored in one array. Each task looks like:
// { id: 1234567890, title: "Finish homework", completed: false }

// The current filter: "all", "pending", or "completed"
let currentFilter = "all";

// A unique id generator based on the current time
let nextTaskId = Date.now();

// Grab the HTML elements we need from the page
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const errorMessage = document.getElementById("errorMessage");
const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");
const totalCount = document.getElementById("totalCount");
const completedCount = document.getElementById("completedCount");
const pendingCount = document.getElementById("pendingCount");
const filterButtons = document.querySelectorAll(".filter-button");

// Load tasks from localStorage when the page first opens.
// If nothing is saved yet, start with an empty list.
let tasks = loadTasksFromStorage();

// ===== Storage helpers =====

// Read tasks from the browser's localStorage and return them as an array
function loadTasksFromStorage() {
  const savedTasks = localStorage.getItem("studentTasks");
  if (savedTasks === null) {
    return [];
  }
  try {
    return JSON.parse(savedTasks);
  } catch (error) {
    return [];
  }
}

// Save the current tasks array into localStorage
function saveTasksToStorage() {
  localStorage.setItem("studentTasks", JSON.stringify(tasks));
}

// ===== Rendering helpers =====

// Figure out which tasks match the current filter
function getVisibleTasks() {
  if (currentFilter === "pending") {
    return tasks.filter(function (task) {
      return task.completed === false;
    });
  }
  if (currentFilter === "completed") {
    return tasks.filter(function (task) {
      return task.completed === true;
    });
  }
  return tasks;
}

// Rebuild the whole task list, stats, and empty-state message on screen
function renderTasks() {
  // Clear whatever is currently on screen
  taskList.innerHTML = "";

  const visibleTasks = getVisibleTasks();

  // Show the empty-state message only when there is nothing to display
  if (visibleTasks.length === 0) {
    emptyState.style.display = "block";
  } else {
    emptyState.style.display = "none";
  }

  // Create one list item per visible task
  visibleTasks.forEach(function (task) {
    const listItem = document.createElement("li");
    listItem.className = "task-item";
    if (task.completed) {
      listItem.classList.add("completed");
    }

    // Checkbox to mark the task complete or pending
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", function () {
      toggleTaskCompleted(task.id);
    });

    // The task title text
    const titleSpan = document.createElement("span");
    titleSpan.className = "task-title";
    titleSpan.textContent = task.title;

    // Delete button to remove the task
    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.textContent = "✕";
    deleteButton.setAttribute("aria-label", "Delete task: " + task.title);
    deleteButton.addEventListener("click", function () {
      deleteTask(task.id);
    });

    listItem.appendChild(checkbox);
    listItem.appendChild(titleSpan);
    listItem.appendChild(deleteButton);
    taskList.appendChild(listItem);
  });

  updateStats();
}

// Refresh the Total / Completed / Pending numbers
function updateStats() {
  const total = tasks.length;
  const completed = tasks.filter(function (task) {
    return task.completed === true;
  }).length;
  const pending = total - completed;

  totalCount.textContent = total;
  completedCount.textContent = completed;
  pendingCount.textContent = pending;
}

// ===== Task actions =====

// Add a new task from whatever was typed into the input
function addTask(title) {
  const trimmedTitle = title.trim();

  // Reject empty or whitespace-only titles
  if (trimmedTitle === "") {
    errorMessage.textContent = "Please enter a task before adding.";
    taskInput.focus();
    return;
  }

  errorMessage.textContent = "";

  const newTask = {
    id: nextTaskId++,
    title: trimmedTitle,
    completed: false,
  };

  tasks.push(newTask);
  saveTasksToStorage();
  renderTasks();

  // Clear the input so the user can type the next task right away
  taskInput.value = "";
  taskInput.focus();
}

// Flip a task between completed and pending
function toggleTaskCompleted(taskId) {
  tasks = tasks.map(function (task) {
    if (task.id === taskId) {
      return { ...task, completed: !task.completed };
    }
    return task;
  });
  saveTasksToStorage();
  renderTasks();
}

// Remove a task from the list
function deleteTask(taskId) {
  tasks = tasks.filter(function (task) {
    return task.id !== taskId;
  });
  saveTasksToStorage();
  renderTasks();
}

// ===== Event listeners =====

// Handle the Add Task form submission
taskForm.addEventListener("submit", function (event) {
  event.preventDefault(); // Stop the page from reloading
  addTask(taskInput.value);
});

// Hide the error message as soon as the user starts typing again
taskInput.addEventListener("input", function () {
  errorMessage.textContent = "";
});

// Handle clicks on the All / Pending / Completed filter buttons
filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    currentFilter = button.getAttribute("data-filter");

    // Move the "active" style to the button that was just clicked
    filterButtons.forEach(function (otherButton) {
      otherButton.classList.remove("active");
    });
    button.classList.add("active");

    renderTasks();
  });
});

// Draw the initial screen (loads saved tasks from localStorage)
renderTasks();
