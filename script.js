const taskList = document.querySelector("#taskList");
const pendingCount = document.querySelector("#pendingCount");
const completedCount = document.querySelector("#completedCount");
const taskDialog = document.querySelector("#taskDialog");
const taskForm = document.querySelector("#taskForm");

function updateTaskCounts() {
  const tasks = [...taskList.querySelectorAll(".task-row")];
  const completed = tasks.filter((task) => task.querySelector("input").checked).length;
  pendingCount.textContent = String(tasks.length - completed).padStart(2, "0");
  completedCount.textContent = String(completed).padStart(2, "0");
}

function createTask({ title, course, due }) {
  const row = document.createElement("label");
  row.className = "task-row";
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  const check = document.createElement("span");
  check.className = "task-check";
  const copy = document.createElement("span");
  copy.className = "task-copy";
  const taskTitle = document.createElement("strong");
  taskTitle.textContent = title;
  const details = document.createElement("small");
  const dueLabel = due ? new Date(`${due}T00:00:00`).toLocaleDateString(undefined, { month: "short", day: "numeric" }) : "No due date";
  details.textContent = [course || "Personal task", `Due ${dueLabel}`].join(" · ");
  const priority = document.createElement("span");
  priority.className = "priority low";
  priority.textContent = "New";
  copy.append(taskTitle, details);
  row.append(checkbox, check, copy, priority);
  checkbox.addEventListener("change", () => {
    row.classList.toggle("completed", checkbox.checked);
    priority.className = checkbox.checked ? "priority done" : "priority low";
    priority.textContent = checkbox.checked ? "Done" : "New";
    updateTaskCounts();
  });
  taskList.prepend(row);
  updateTaskCounts();
}

document.querySelector("#addTaskButton").addEventListener("click", () => {
  taskForm.reset();
  taskDialog.showModal();
  document.querySelector("#taskTitle").focus();
});

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(taskForm);
  const title = String(formData.get("title") || "").trim();
  if (!title) return;
  createTask({
    title,
    course: String(formData.get("course") || "").trim(),
    due: String(formData.get("due") || "")
  });
  taskDialog.close();
});

taskList.addEventListener("change", (event) => {
  if (event.target.matches('input[type="checkbox"]')) {
    const row = event.target.closest(".task-row");
    if (!row) return;
    row.classList.toggle("completed", event.target.checked);
    const priority = row.querySelector(".priority");
    if (priority) {
      priority.className = event.target.checked ? "priority done" : "priority low";
      priority.textContent = event.target.checked ? "Done" : "New";
    }
    updateTaskCounts();
  }
});

const menuButton = document.querySelector("#menuButton");
const sidebar = document.querySelector("#sidebar");
menuButton.addEventListener("click", () => {
  const isOpen = sidebar.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});
sidebar.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    sidebar.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    sidebar.querySelectorAll(".nav-link").forEach((item) => item.classList.remove("active"));
    link.classList.add("active");
  });
});

document.querySelector("#todayLabel").textContent = new Date().toLocaleDateString(undefined, {
  weekday: "long", month: "long", day: "numeric"
}).toUpperCase();
updateTaskCounts();