class TaskList {
    constructor(name) {
        this.id = Date.now(); // Unique ID based on timestamp
        this.name = name;
        this.tasks = [];
    }

    addTask(task) {
        this.tasks.push(task);
        this.saveTasks();
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.saveTasks();
    }

    editTask(id, newText) {
        const task = this.tasks.find(task => task.id === id);
        if (task) {
            task.text = newText;
            this.saveTasks();
        }
    }

    toggleTaskDone(id) {
        const task = this.tasks.find(task => task.id === id);
        if (task) {
            task.done = !task.done;
            this.saveTasks();
        }
    }

    saveTasks() {
        const taskLists = JSON.parse(localStorage.getItem('taskLists')) || [];
        const taskListIndex = taskLists.findIndex(tl => tl.id === this.id);
        if (taskListIndex > -1) {
            taskLists[taskListIndex] = this;
        } else {
            taskLists.push(this);
        }
        localStorage.setItem('taskLists', JSON.stringify(taskLists));
    }

    getTasks() {
        return this.tasks;
    }

    getCompletedTasks() {
        return this.tasks.filter(task => task.done).length;
    }
}
