let tasks = [];
const taskTableBody = document.getElementById("taskTableBody");
const taskForm = document.getElementById("taskForm");
const noTasksMessage = document.getElementById("noTasksMessage");
const submitButton = taskForm.querySelector("button");
let isEditing = false;
let currentTaskId = null;
const serverUrl = "https://68ad07cdb996fea1c08b65ec.mockapi.io/crud";

// Fetch tasks from the API and render them
function fetchTasks() {
  fetch(serverUrl)
    .then((res) => res.json())
    .then((data) => {
      tasks = data;
      renderTasks();
      alert("Tasks loaded successfully.");
    })
    .catch((error) => console.log("Error fetching tasks:", error));
}

// Render tasks in the table
function renderTasks() {
  if (tasks.length === 0) {
    noTasksMessage.style.display = "block";
    taskTableBody.innerHTML = ""; // Clear table body
  } else {
    noTasksMessage.style.display = "none";
    taskTableBody.innerHTML = tasks
      .map(
        (task) => `
          <tr>
            <td>${task.id}</td>
            <td>${task.name}</td>
            <td>${task.email}</td>
            <td>${task.phone}</td>
            <td>
              <div class="action-buttons">
                <button onclick="editTask('${task.id}')">Edit</button>
                <button class="delete-button" onclick="deleteTask('${task.id}')">Delete</button>
              </div>
            </td>
          </tr>
        `
      )
      .join("");
  }
}

// Add or Update a Task
taskForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;

  if (isEditing) {
    // Update Task
    fetch(`${serverUrl}/${currentTaskId}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name, email, phone }),
    })
      .then((res) => res.json())
      .then((updatedTask) => {
        tasks = tasks.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        );
        renderTasks();
        resetForm();
        alert("Task updated successfully.");
      })
      .catch((error) => console.log("Error updating task:", error));
  } else {
    // Add Task
    fetch(serverUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name, email, phone }),
    })
      .then((res) => res.json())
      .then((newTask) => {
        tasks.push(newTask);
        renderTasks();
        resetForm();
        alert("Task added successfully.");
      })
      .catch((error) => console.log("Error adding task:", error));
  }
});

// Edit a Task
function editTask(id) {
  const task = tasks.find((t) => t.id === id);
  if (!task) return;
  isEditing = true;
  currentTaskId = id;
  submitButton.textContent = "Edit Task";
  document.getElementById("name").value = task.name;
  document.getElementById("email").value = task.email;
  document.getElementById("phone").value = task.phone;
}

// Delete a Task
function deleteTask(id) {
  fetch(`${serverUrl}/${id}`, {
    method: "DELETE",
  })
    .then((res) => {
      if (res.ok) {
        tasks = tasks.filter((task) => task.id !== id);
        renderTasks();
        alert("Task deleted successfully.");
      }
    })
    .catch((error) => console.log("Error deleting task:", error));
}

// Reset Form
function resetForm() {
  isEditing = false;
  currentTaskId = null;
  taskForm.reset();
  submitButton.textContent = "Add Task";
}

// Fetch tasks on page load
fetchTasks();
