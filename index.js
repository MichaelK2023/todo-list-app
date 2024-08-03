const express = require('express');
const app = express();
const PORT = 3000;
const path = require('node:path');
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

let tasks = [];

// Route for index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route for getting tasks
app.get('/tasks', (req, res) => {
    res.status(200).json(tasks);
});

// Create a Task
app.post('/tasks', (req, res) => {
    const { title, description } = req.body;
    if (!title) {
        return res.status(400).send("Task title is required");
    }
    const newTask = {
        id: tasks.length + 1,  // Generate a unique ID
        title,
        description,
        completed: false
    };
    tasks.push(newTask);
    res.status(201).json(newTask);
});

// Update a task
app.put('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { title, description, completed } = req.body;
    const taskIndex = tasks.findIndex(task => task.id === parseInt(id));
    if (taskIndex === -1) {
        return res.status(404).send("Task not found");
    }
    const updatedTask = { ...tasks[taskIndex], title, description, completed };
    tasks[taskIndex] = updatedTask;
    res.status(200).json(updatedTask);
});

// Complete a task
app.put('/tasks/:id/completed', (req, res) => {
    const { id } = req.params;
    const { completed } = req.body;
    const taskIndex = tasks.findIndex(task => task.id === parseInt(id));
    if (taskIndex === -1) {
        return res.status(404).send("Task not found");
    }
    tasks[taskIndex].completed = completed;
    res.status(200).json(tasks[taskIndex]);
});

// Clear all completed tasks
app.delete('/tasks/completed', (req, res) => {
    tasks = tasks.filter(task => !task.completed);
    res.status(200).send("Completed tasks cleared");
});

// Delete a Task
app.delete('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const taskIndex = tasks.findIndex(task => task.id === parseInt(id));
    if (taskIndex === -1) {
        return res.status(404).send("Task not found");
    }
    tasks.splice(taskIndex, 1);
    res.status(200).send("Task deleted");
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
