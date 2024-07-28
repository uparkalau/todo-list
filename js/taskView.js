class TaskView {
    constructor(taskList) {
        this.taskList = taskList;
        this.ul = document.getElementById("taskList");
        this.progressBar = document.getElementById("progressBar");
        this.progressText = document.getElementById("progressText");
        this.progressContainer = document.getElementById("progressContainer");
    }

    updateTaskList(taskList) {
        this.taskList = taskList;
    }

    render() {
        if (!this.taskList) return;
        this.ul.innerHTML = '';
        this.taskList.getTasks().forEach(task => {
            const li = document.createElement("li");
            const taskText = task.text.length > 30 ? task.text.substring(0, 30) + '...' : task.text;
            li.appendChild(document.createTextNode(taskText));
            li.title = task.text;
            if (task.done) {
                li.classList.add("done");
            }
            this.ul.appendChild(li);

            let clickTimeout;

            li.addEventListener("click", () => {
                clearTimeout(clickTimeout);
                clickTimeout = setTimeout(() => {
                    this.toggleTaskDone(task.id);
                }, 300);
            });

            li.addEventListener("dblclick", (event) => {
                clearTimeout(clickTimeout);
                event.stopPropagation();
                this.editTask(task.id);
            });

            const editButton = document.createElement("button");
            editButton.classList.add('edit-btn');
            editButton.innerHTML = '<i class="bi bi-pencil"></i>';
            editButton.addEventListener('click', (event) => {
                event.stopPropagation();
                this.editTask(task.id);
            });
            li.appendChild(editButton);

            const taskDateSpan = document.createElement("span");
            taskDateSpan.classList.add("task-date");

            if (task.created_date instanceof Date) {
                taskDateSpan.textContent = task.created_date.toLocaleDateString();
            } else {
                taskDateSpan.textContent = "N/A"; 
            }

            li.insertBefore(taskDateSpan, li.firstChild);

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

    editTask(taskId) {
        const task = this.taskList.getTasks().find(task => task.id === taskId);
        app.input.value = task.text;
        app.input.focus();
        app.editingTaskIndex = taskId;
        app.input.placeholder = "Edit task...";
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
