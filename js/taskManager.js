class TaskManager {
    constructor() {
        this.taskLists = JSON.parse(localStorage.getItem('taskLists')) || [];
        this.nextTaskListId = 1;
        for (const taskList of this.taskLists) {
            this.nextTaskListId = Math.max(this.nextTaskListId, taskList.id + 1);
        }
    }

    addTaskList(taskList) {
        taskList.id = this.nextTaskListId++; 
        this.taskLists.push(taskList);
        this.saveTaskLists();
    }

    deleteTaskList(id) {
        this.taskLists = this.taskLists.filter(taskList => taskList.id !== id);
        this.saveTaskLists();
    }

    getTaskLists() {
        return this.taskLists.map(taskList => {
            const tl = new TaskList(taskList.name);
            tl.id = taskList.id;
            tl.tasks = taskList.tasks.map(task => {
                const t = new Task(task.text, task.done);
                t.id = task.id;
                t.created_date = new Date(task.created_date);
                return t;
            });
            return tl;
        });
    }

    saveTaskLists() {
        localStorage.setItem('taskLists', JSON.stringify(this.taskLists));
    }

    searchTasks(query) {
        const results = [];
        this.taskLists.forEach(taskList => {
            if (taskList.name.toLowerCase().includes(query.toLowerCase())) {
                results.push({ taskList: taskList.name, task: '' });
            }
            taskList.tasks.forEach(task => {
                if (task.text.toLowerCase().includes(query.toLowerCase())) {
                    results.push({ taskList: taskList.name, task: task.text });
                }
            });
        });
        return results;
    }
}
