class TodoApp {
    constructor() {
        this.taskManager = new TaskManager();
        this.taskList = null;
        this.taskView = new TaskView();

        this.enterButton = document.getElementById("enter");
        this.input = document.getElementById("userInput");
        this.createTaskListButton = document.getElementById("createTaskList");
        this.searchInput = document.getElementById("searchInput");
        this.taskListsContainer = document.getElementById("taskListsContainer");
        this.taskListView = document.getElementById("taskListView");
        this.backToListsButton = document.getElementById("backToLists");
        this.themeToggle = document.getElementById("themeToggle");
        this.themeIcon = document.getElementById("themeIcon");
        this.sortTasksByDateButton = document.getElementById("sortTasksByDate");
        this.deleteCompletedTasksButton = document.getElementById("deleteCompletedTasks");

        // Bind event listeners
        this.createTaskListButton.addEventListener("click", this.createTaskList.bind(this));
        this.searchInput.addEventListener("input", this.searchTasks.bind(this));
        this.backToListsButton.addEventListener("click", this.showTaskLists.bind(this));
        this.enterButton.addEventListener("click", this.addTask.bind(this));
        this.input.addEventListener("keypress", this.addTaskOnEnter.bind(this));
        this.themeToggle.addEventListener("click", this.toggleTheme.bind(this));

        this.sortTasksByDateButton.addEventListener("click", () => {
            if (this.taskList) {
                this.taskList.sortTasksByDate();
                this.taskView.render();
            }
        });

        this.deleteCompletedTasksButton.addEventListener("click", () => {
            if (this.taskList) {
                this.taskList.deleteCompletedTasks();
                this.taskView.render();
            }
        });

        this.loadTheme();
        this.showTaskLists();
        this.editingTaskIndex = null;
        this.editingTaskListId = null;
    }

    createTaskList() {
        const name = prompt("Enter the name of the new task list:");
        const sanitizedName = sanitizeInput(name);
        if (sanitizedName && sanitizedName.trim().length >= 3) {
            const taskList = new TaskList(sanitizedName.trim());
            this.taskManager.addTaskList(taskList);
            this.showTaskLists(); // Refresh the list of task lists
        } else {
            alert("Task list name must be at least 3 characters long.");
        }
    }

    showTaskLists() {
        this.taskListsContainer.innerHTML = "";
        this.taskListView.style.display = "none";
        this.taskListsContainer.style.display = "block";
        this.input.value = "";
        this.input.placeholder = "New task list...";

        // Fetch updated task lists from TaskManager
        const taskLists = this.taskManager.getTaskLists();

        taskLists.forEach(taskList => {
            const div = document.createElement("div");
            div.classList.add("task-list-tile");
            div.textContent = taskList.name;
            div.addEventListener("click", () => this.showTaskList(taskList.id));
            this.taskListsContainer.appendChild(div);
        });
    }

    showTaskList(id) {
        this.taskListsContainer.style.display = 'none';
        this.taskListView.style.display = 'block';
        this.input.placeholder = "New task...";

        const taskLists = this.taskManager.getTaskLists();
        this.taskList = taskLists.find(taskList => taskList.id === id);

        if (this.taskList) {
            this.taskView.updateTaskList(this.taskList);
            this.taskView.render();
        } else {
            console.error("Task List not found in local storage");
        }
    }

    addTask() {
        const taskName = this.input.value.trim();
        const sanitizedTaskName = sanitizeInput(taskName);
        if (sanitizedTaskName && sanitizedTaskName.length >= 3) {
            if (this.editingTaskIndex !== null) {
                this.taskList.editTask(this.editingTaskIndex, sanitizedTaskName);
                this.editingTaskIndex = null;
            } else {
                if (this.taskList) {
                    this.taskList.addTask(new Task(sanitizedTaskName));
                } else {
                    const newTaskList = new TaskList(sanitizedTaskName);
                    this.taskManager.addTaskList(newTaskList);
                    this.showTaskList(newTaskList.id); // Show the new task list
                    return;
                }
            }

            this.taskView.render();
            this.input.value = '';
            this.input.placeholder = "New task...";
        } else {
            alert("Task name must be at least 3 characters long.");
        }
    }

    addTaskOnEnter(event) {
        if (event.key === 'Enter' && this.input.value.trim()) {
            this.addTask();
        }
    }

    searchTasks() {
        const query = this.searchInput.value;
        const results = this.taskManager.searchTasks(query);
        this.taskListsContainer.innerHTML = '';

        results.forEach(result => {
            const div = document.createElement("div");
            div.classList.add("search-result");
            div.textContent = result.task ? `${result.taskList}: ${sanitizeInput(result.task)}` : `${sanitizeInput(result.taskList)}`;
            div.addEventListener("click", () => {
                const taskList = this.taskManager.getTaskLists().find(tl => tl.name === result.taskList);
                if (taskList) {
                    this.showTaskList(taskList.id);
                }
            });
            this.taskListsContainer.appendChild(div);
        });
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

new TodoApp();
