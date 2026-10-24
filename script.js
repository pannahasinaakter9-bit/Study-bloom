let seconds = 25 * 60;
let timer = null;

const display = document.getElementById("timerDisplay");
const timerButton = document.getElementById("timerStart");

function renderTimer() {
  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  display.textContent = `${m}:${s}`;
}

function setTimer(minutes) {
  clearInterval(timer);
  timer = null;
  seconds = minutes * 60;
  timerButton.textContent = "Start";
  renderTimer();
}

function toggleTimer() {
  if (timer) {
    clearInterval(timer);
    timer = null;
    timerButton.textContent = "Start";
    return;
  }

  if (seconds <= 0) seconds = 25 * 60;
  timerButton.textContent = "Pause";

  timer = setInterval(() => {
    if (seconds > 0) {
      seconds--;
      renderTimer();
    } else {
      clearInterval(timer);
      timer = null;
      timerButton.textContent = "Start";
      toast("🎉 Nice work! Take a short break.");
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(timer);
  timer = null;
  seconds = 25 * 60;
  timerButton.textContent = "Start";
  renderTimer();
}

let tasks = JSON.parse(localStorage.getItem("studybloomTasks") || "[]");

function saveTasks() {
  localStorage.setItem("studybloomTasks", JSON.stringify(tasks));
}

function drawTasks() {
  const ul = document.getElementById("taskList");
  ul.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = task.done ? "done" : "";

    li.innerHTML =
      `<input type="checkbox" ${task.done ? "checked" : ""} onchange="toggleTask(${index})">
       <span>${escapeHtml(task.text)}</span>
       <button onclick="deleteTask(${index})" aria-label="Delete task">×</button>`;

    ul.appendChild(li);
  });

  document.getElementById("taskProgress").textContent =
    `${tasks.filter(task => task.done).length} of ${tasks.length} complete`;
}

function escapeHtml(text) {
  return text.replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[character]));
}

function addTask() {
  const input = document.getElementById("taskInput");
  const value = input.value.trim();

  if (!value) return;

  tasks.push({ text: value, done: false });
  input.value = "";
  saveTasks();
  drawTasks();
}

document.getElementById("taskInput").addEventListener("keydown", event => {
  if (event.key === "Enter") addTask();
});

function toggleTask(index) {
  tasks[index].done = !tasks[index].done;
  saveTasks();
  drawTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  drawTasks();
}

const tips = [
  "Start with ten minutes. You can always do more later.",
  "Pick one clear task instead of telling yourself to study everything.",
  "Keep your phone out of reach while the timer is running.",
  "Try to remember the answer before looking back at your notes.",
  "Make the first task so small that starting feels easy.",
  "A short focused session beats a long distracted one."
];

function newTip() {
  document.getElementById("tipText").textContent =
    tips[Math.floor(Math.random() * tips.length)];
}

function startChallenge() {
  setTimer(10);
  toggleTimer();
  document.getElementById("tools").scrollIntoView({ behavior: "smooth" });
  toast("🔥 Your 10-minute challenge has started!");
}

function makeEmergencyPlan() {
  const hours = Number(document.getElementById("examHours").value);
  const blocks = Math.max(2, Math.floor(hours * 2));
  const list = [];

  for (let i = 1; i <= blocks; i++) {
    if (i === blocks) {
      list.push("Quick review, pack your things, and stop on time.");
    } else if (i % 3 === 0) {
      list.push("Close your notes and test yourself on what you remember.");
    } else if (i % 2 === 1) {
      list.push("Work on your hardest topic first.");
    } else {
      list.push("Do a few practice questions or MCQs.");
    }
  }

  document.getElementById("emergencyResult").innerHTML =
    `<b>Your ${hours}-hour plan</b>
     <ol>${list.map(item => `<li>${item}</li>`).join("")}</ol>
     <small>Take short breaks between focused blocks.</small>`;
}

function toast(message) {
  const box = document.getElementById("toast");
  box.textContent = message;
  box.classList.add("show");
  setTimeout(() => box.classList.remove("show"), 2200);
}

function toggleMenu() {
  const nav = document.getElementById("mainNav");
  const isOpen = nav.style.display === "flex";

  nav.style.display = isOpen ? "none" : "flex";
  nav.style.position = "absolute";
  nav.style.right = "5%";
  nav.style.top = "60px";
  nav.style.background = "#fff";
  nav.style.padding = "15px";
  nav.style.borderRadius = "15px";
  nav.style.flexDirection = "column";
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

renderTimer();
drawTasks();
