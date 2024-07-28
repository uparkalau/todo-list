class TaskList {
    constructor(name) {
        this.id = Date.now();
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

    deleteCompletedTasks() {
        this.tasks = this.tasks.filter(task => !task.done);
        this.saveTasks();
    }

    saveTasks() {
        const taskLists = JSON.parse(localStorage.getItem('taskLists')) || [];
        const taskListIndex = taskLists.findIndex(tl => tl.id === this.id);
        if (taskListIndex > -1) {
            taskLists[taskListIndex] = {
                ...this,
                tasks: this.tasks.map(task => ({
                    ...task,
                    created_date: task.created_date instanceof Date ? task.created_date.toISOString() : task.created_date
                }))
            };
        } else {
            taskLists.push({
                ...this,
                tasks: this.tasks.map(task => ({
                    ...task,
                    created_date: task.created_date instanceof Date ? task.created_date.toISOString() : task.created_date
                }))
            });
        }
        localStorage.setItem('taskLists', JSON.stringify(taskLists));
    }

    getTasks() {
        return this.tasks.map(task => ({
            ...task,
            created_date: new Date(task.created_date)
        }));
    }

    getCompletedTasks() {
        return this.tasks.filter(task => task.done).length;
    }

    sortTasksByDate() {
        this.tasks.sort((a, b) => new Date(a.created_date) - new Date(b.created_date));
        this.saveTasks();
    }
}
