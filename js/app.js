class TodoApp {
    constructor() {
        this.taskManager = new TaskManager();
        this.taskList = null;
        this.taskView = null;
        this.enterButton = document.getElementById("enter");
        this.input = document.getElementById("userInput");
        this.createTaskListButton = document.getElementById("createTaskList");
        this.searchInput = document.getElementById("searchInput");
        this.taskListsContainer = document.getElementById("taskListsContainer");
        this.taskListView = document.getElementById("taskListView");
        this.backToListsButton = document.getElementById("backToLists");
        this.themeToggle = document.getElementById("themeToggle");
        this.themeIcon = document.getElementById("themeIcon");

        this.createTaskListButton.addEventListener("click", this.createTaskList.bind(this));
        this.searchInput.addEventListener("input", this.searchTasks.bind(this));
        this.backToListsButton.addEventListener("click", this.showTaskLists.bind(this));
        this.enterButton.addEventListener("click", this.addTask.bind(this));
        this.input.addEventListener("keypress", this.addTaskOnEnter.bind(this));
        this.themeToggle.addEventListener("click", this.toggleTheme.bind(this));

        this.loadTheme();
        this.showTaskLists();
    }

    createTaskList() {
        const name = prompt("Enter the name of the new task list:");
        if (name) {
            const taskList = new TaskList(name);
            this.taskManager.addTaskList(taskList);
            this.showTaskLists();
        }
    }

    showTaskLists() {
        this.taskListsContainer.innerHTML = '';
        this.taskListView.style.display = 'none';
        this.taskListsContainer.style.display = 'block';

        this.taskManager.getTaskLists().forEach(taskList => {
            const div = document.createElement("div");
            div.classList.add("task-list-tile");
            div.textContent = taskList.name;
            div.addEventListener("click", () => this.showTaskList(taskList.id));
            this.taskListsContainer.appendChild(div);
        });
    }

    showTaskList(id) {
        const taskList = this.taskManager.getTaskLists().find(taskList => taskList.id === id);
        if (taskList) {
            console.log("Found Task List:", taskList);
            this.taskList = taskList;
            this.taskView = new TaskView(this.taskList);
            this.taskListsContainer.style.display = 'none';
            this.taskListView.style.display = 'block';
            this.taskView.render();
        } else {
            console.log("Task List not found");
        }
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

    searchTasks() {
        const query = this.searchInput.value;
        const results = this.taskManager.searchTasks(query);
        this.taskListsContainer.innerHTML = '';

        results.forEach(result => {
            const div = document.createElement("div");
            div.classList.add("search-result");
            div.textContent = result.task ? `${result.taskList}: ${result.task}` : `${result.taskList}`;
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

// Initialize the app
new TodoApp();
