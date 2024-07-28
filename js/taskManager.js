class TaskManager {
    constructor() {
        this.taskLists = JSON.parse(localStorage.getItem('taskLists')) || [];
    }

    addTaskList(taskList) {
        taskList.id = Date.now(); // Assign a unique ID based on timestamp
        this.taskLists.push(taskList);
        this.saveTaskLists();
    }

    deleteTaskList(id) {
        this.taskLists = this.taskLists.filter(taskList => taskList.id !== id);
        this.saveTaskLists();
    }

    getTaskLists() {
        return this.taskLists;
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
