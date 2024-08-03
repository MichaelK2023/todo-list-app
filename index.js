const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());


let tasks = [];

// Basic route for getting tasks
app.get('/tasks', (req, res) => {
    res.status(200).json(tasks);
});

app.post('/tasks', (req, res) => {
    const { title, description } = req.body;
    if (!title) {
        return res.status(400).send("Task title is required");
    }
    // Create a new task object
    const newTask = {
        id: tasks.length + 1,  // generate a unique ID
        title,
        description
    };
    tasks.push(newTask);  // Add the new task to the array
    res.status(201).json(newTask);
});

app.put('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;
    const taskIndex = tasks.findIndex(task => task.id === parseInt(id));
    if (taskIndex === -1) {
        return res.status(404).send("Task not found");
    }
    const updatedTask = { ...tasks[taskIndex], title, description };
    tasks[taskIndex] = updatedTask;
    res.status(200).json(updatedTask);
});

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
