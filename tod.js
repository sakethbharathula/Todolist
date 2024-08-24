document.addEventListener('DOMContentLoaded', () => {
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');
    const tasksContainer = document.querySelector('.tasks-container');

    // Load tasks from localStorage
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(taskData => {
            const task = createTaskElement(taskData.text, taskData.completed);
            taskList.appendChild(task);
        });
        updateTasksVisibility();
    }

    // Save tasks to localStorage
    function saveTasks() {
        const tasks = Array.from(taskList.children).map(task => ({
            text: task.querySelector('.task-text').textContent,
            completed: task.classList.contains('completed')
        }));
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Create a task element
    function createTaskElement(text, completed = false) {
        const task = document.createElement('li');
        task.className = 'task';
        if (completed) {
            task.classList.add('completed');
        }
        task.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${completed ? 'checked' : ''}>
            <span class="task-text">${text}</span>
            <span class="task-party-wrapper">${completed ? '🎉' : ''}</span>
            <div class="task-buttons">
                <i class="edit-icon">✎</i>
                <i class="delete-icon">🗑️</i>
            </div>
        `;
        return task;
    }

    function updateTasksVisibility() {
        tasksContainer.style.display = taskList.children.length > 0 ? 'block' : 'none';
    }

    function updateFilterVisibility(filter) {
        const tasks = Array.from(taskList.children);

        tasks.forEach(task => {
            switch (filter) {
                case 'all':
                    task.style.display = 'flex';
                    break;
                case 'completed':
                    task.style.display = task.classList.contains('completed') ? 'flex' : 'none';
                    break;
                case 'pending':
                    task.style.display = !task.classList.contains('completed') ? 'flex' : 'none';
                    break;
            }
        });
        updateTasksVisibility();
    }

    // Add a new task
    addTaskBtn.addEventListener('click', () => {
        const text = taskInput.value.trim();
        if (text) {
            const task = createTaskElement(text);
            taskList.appendChild(task);
            taskInput.value = '';
            saveTasks();
            updateTasksVisibility();
        }
    });

    // Handle task list click events
    taskList.addEventListener('click', e => {
        const target = e.target;
        const task = target.closest('.task');
        if (!task) return;

        if (target.classList.contains('task-checkbox')) {
            task.classList.toggle('completed');
            const partyWrapper = task.querySelector('.task-party-wrapper');
            partyWrapper.textContent = task.classList.contains('completed') ? '🎉' : '';
            saveTasks();
        }

        if (target.classList.contains('delete-icon')) {
            task.classList.add('fade-out');
            setTimeout(() => {
                task.remove();
                saveTasks();
                updateTasksVisibility();
            }, 300); // Match the fade-out duration
        }
        
        if (target.classList.contains('edit-icon')) {
            const taskText = task.querySelector('.task-text');
            const currentText = taskText.textContent;
            taskText.innerHTML = `<input type="text" class="edit-input" value="${currentText}">`;
            const editInput = taskText.querySelector('.edit-input');
            editInput.focus();

            editInput.addEventListener('blur', () => {
                const newText = editInput.value.trim();
                if (newText) {
                    taskText.textContent = newText;
                    saveTasks();
                } else {
                    taskText.textContent = currentText; // Revert if no new text
                }
            });

            editInput.addEventListener('keypress', e => {
                if (e.key === 'Enter') {
                    editInput.blur(); // Trigger blur event on Enter
                }
            });
        }
    });

    // Handle filter button clicks
    document.querySelector('.filter-container').addEventListener('click', e => {
        if (e.target.classList.contains('filter-btn')) {
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            const filter = e.target.dataset.filter;
            updateFilterVisibility(filter);
        }
    });

    // Load tasks initially
    loadTasks();
});
