document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskTitle = document.getElementById('task-title');
    const taskDescription = document.getElementById('task-description');
    const taskList = document.getElementById('task-list');
    const clearCompletedButton = document.getElementById('clear-completed');

    loadTasks();

    // add task
    taskForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = taskTitle.value.trim();
        const description = taskDescription.value.trim();

        if (title) {
            const task = {
                title,
                description,
                completed: false
            };

            await addTaskToBackend(task);
            loadTasks();

            taskTitle.value = '';
            taskDescription.value = '';
        }
    });

    // toggle task completion
    taskList.addEventListener('click', async (e) => {
        if (e.target.classList.contains('complete-btn')) {
            const li = e.target.parentElement;
            const taskId = parseInt(li.getAttribute('data-id'));
            const isCompleted = li.classList.contains('completed');


            await toggleTaskCompletionOnBackend(taskId, !isCompleted);
            loadTasks();
        } else if (e.target.classList.contains('delete-btn')) {
            const li = e.target.parentElement;
            const taskId = parseInt(li.getAttribute('data-id'));

            await deleteTaskFromBackend(taskId);
            li.remove();
        }
    });
    
    // clear completed tasks
    clearCompletedButton.addEventListener('click', async () => {
        await clearCompletedTasksFromBackend();
        loadTasks();
    });

    async function addTaskToBackend(task) {
        await fetch('/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(task)
        });
    }


    async function loadTasks() {
        const response = await fetch('/tasks');
        const tasks = await response.json();
        taskList.innerHTML = '';
        tasks.forEach(task => {
            addTaskToDOM(task);
        });
    }
    
    async function toggleTaskCompletionOnBackend(id, completed) {
        await fetch(`/tasks/${id}/completed`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ completed })
        });
    }

    async function deleteTaskFromBackend(id) {
        await fetch(`/tasks/${id}`, {
            method: 'DELETE'
        });
    }


    async function clearCompletedTasksFromBackend() {
        await fetch('/tasks/completed', {
            method: 'DELETE'
        });
    }

    function addTaskToDOM(task) {
        const li = document.createElement('li');
        li.setAttribute('data-id', task.id);
        li.innerHTML = `
            <span>${task.title}</span>
            <button class="complete-btn">${task.completed ? 'Undo' : 'Complete'}</button>
            <button class="delete-btn">Delete</button>
        `;
        if (task.completed) {
            li.classList.add('completed');
        }
        taskList.appendChild(li);
    }
});
