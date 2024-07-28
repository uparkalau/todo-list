class Task {
  constructor(text, done = false) {
    this.text = text;
    this.done = done;
  }
}

class TaskList {
  constructor() {
    this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  }

  addTask(task) {
    this.tasks.push(task);
    this.saveTasks();
  }

  deleteTask(index) {
    this.tasks.splice(index, 1);
    this.saveTasks();
  }

  editTask(index, newText) {
    this.tasks[index].text = newText;
    this.saveTasks();
  }

  toggleTaskDone(index) {
    if (index >= 0 && index < this.tasks.length) {
      this.tasks[index].done = !this.tasks[index].done;
      this.saveTasks();
    }
  }

  saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  getTasks() {
    return this.tasks;
  }

  getCompletedTasks() {
    return this.tasks.filter(task => task.done).length;
  }
}

class TaskView {
  constructor(taskList) {
    this.taskList = taskList;
    this.ul = document.getElementById("taskList");
    this.progressBar = document.getElementById("progressBar");
  }

  render() {
    this.ul.innerHTML = '';
    this.taskList.getTasks().forEach((task, index) => {
      const li = document.createElement("li");
      li.appendChild(document.createTextNode(task.text));
      if (task.done) {
        li.classList.add("done");
      }
      this.ul.appendChild(li);

      li.addEventListener("click", () => this.toggleTaskDone(index));
      li.addEventListener("dblclick", () => this.editTask(index));
      this.addDeleteButton(li, index);
    });
    this.updateProgressBar();
  }

  addDeleteButton(li, index) {
    const dBtn = document.createElement("button");
    dBtn.appendChild(document.createTextNode("X"));
    dBtn.classList.add("delete-btn");
    li.appendChild(dBtn);

    dBtn.addEventListener("click", () => {
      this.taskList.deleteTask(index);
      this.render();
    });
  }

  toggleTaskDone(index) {
    this.taskList.toggleTaskDone(index);
    this.render();
  }

  editTask(index) {
    const newText = prompt("Edit your task:", this.taskList.getTasks()[index].text);
    if (newText) {
      this.taskList.editTask(index, newText);
      this.render();
    }
  }

  updateProgressBar() {
    const totalTasks = this.taskList.getTasks().length;
    const completedTasks = this.taskList.getCompletedTasks();
    const progress = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;
    this.progressBar.style.width = `${progress}%`;
  }
}

class TodoApp {
  constructor() {
    this.taskList = new TaskList();
    this.taskView = new TaskView(this.taskList);
    this.enterButton = document.getElementById("enter");
    this.input = document.getElementById("userInput");
    this.themeToggle = document.getElementById("themeToggle");
    this.themeIcon = document.getElementById("themeIcon");

    this.enterButton.addEventListener("click", this.addTask.bind(this));
    this.input.addEventListener("keypress", this.addTaskOnEnter.bind(this));
    this.themeToggle.addEventListener("click", this.toggleTheme.bind(this));
    this.taskView.render();
    this.loadTheme();
  }

  addTask() {
    if (this.input.value.trim()) {
      const task = new Task(this.input.value);
      this.taskList.addTask(task);
      this.input.value = '';
      this.taskView.render();
    }
  }

  addTaskOnEnter(event) {
    if (event.key === 'Enter' && this.input.value.trim()) {
      this.addTask();
    }
  }

  toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    this.themeIcon.className = isDark ? 'bi bi-moon' : 'bi bi-sun';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }

  loadTheme() {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
      this.themeIcon.className = 'bi bi-moon';
    } else {
      this.themeIcon.className = 'bi bi-sun';
    }
  }
}

// Initialize the app
new TodoApp();
