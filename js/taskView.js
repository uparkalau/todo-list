class TaskView {
    constructor(taskList) {
        this.taskList = taskList;
        this.ul = document.getElementById("taskList");
        this.progressBar = document.getElementById("progressBar");
        this.progressText = document.getElementById("progressText");
        this.progressContainer = document.getElementById("progressContainer");
    }

    render() {
        this.ul.innerHTML = '';
        this.taskList.getTasks().forEach(task => {
            const li = document.createElement("li");
            const taskText = task.text.length > 30 ? task.text.substring(0, 30) + '...' : task.text;
            li.appendChild(document.createTextNode(taskText));
            li.title = task.text; // Tooltip with full text
            if (task.done) {
                li.classList.add("done");
            }
            this.ul.appendChild(li);

            li.addEventListener("click", () => this.toggleTaskDone(task.id));
            li.addEventListener("dblclick", () => this.editTask(task.id));
            this.addDeleteButton(li, task.id);
        });
        this.updateProgressBar();
    }

    addDeleteButton(li, id) {
        const dBtn = document.createElement("button");
        dBtn.innerHTML = '<i class="bi bi-trash"></i>';
        dBtn.classList.add("delete-btn");
        li.appendChild(dBtn);

        dBtn.addEventListener("click", () => {
            this.taskList.deleteTask(id);
            this.render();
        });
    }

    toggleTaskDone(id) {
        this.taskList.toggleTaskDone(id);
        this.render();
    }

    editTask(id) {
        const task = this.taskList.getTasks().find(task => task.id === id);
        const newText = prompt("Edit your task:", task.text);
        if (newText) {
            this.taskList.editTask(id, newText);
            this.render();
        }
    }

    updateProgressBar() {
        const totalTasks = this.taskList.getTasks().length;
        const completedTasks = this.taskList.getCompletedTasks();
        const progress = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;
        this.progressBar.style.width = `${progress}%`;
        this.progressText.textContent = `${Math.round(progress)}%`;

        if (totalTasks === 0) {
            this.progressContainer.style.display = 'none';
        } else {
            this.progressContainer.style.display = 'block';
        }
    }
    
}
