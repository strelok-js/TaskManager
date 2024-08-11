const express = require('express');
const router = express.Router();
const Task = require('../DB/taskModels.js');

// req.user.id добавляется в needAuth функции auth.js

// Все задачи
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.id });
        res.json(tasks);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Создание новой
router.post('/',  async (req, res) => {
    try {
        const { title, description } = req.body;
        const newTask = new Task({
            title,
            description,
            user: req.user.id
        });
        const task = await newTask.save();
        res.json(task);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Обновление
router.put('/:id', async (req, res) => {
    try {
        const { title, description, completed } = req.body;
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ msg: 'Task not found' });

        task.title = title || task.title;
        task.description = description || task.description;
        task.completed = completed !== undefined ? completed : task.completed;

        await task.save();
        res.json(task);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Удаление
router.delete('/:id', async (req, res) => {
    try {
        if (!await Task.findById(req.params.id)) return res.status(404).json({ msg: 'Task not found' });

        await Task.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Task removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
