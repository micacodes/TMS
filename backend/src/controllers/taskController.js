const db = require('../config/db');
const { validationResult } = require('express-validator');

// Helper function (to see if the tasks belongs t the user who just loggedn in)
const checkTaskOwnership = async (taskId, userId) => {
    const [tasks] = await db.query('SELECT user_id FROM tasks WHERE id = ?', [taskId]);
    if (tasks.length === 0) {
      return { exists: false, isOwner: false };
    }
    return { exists: true, isOwner: tasks[0].user_id === userId };
};

//filtering all tasks for an authenitacted user
exports.getTasks = async (req, res) => {
    const userId = req.user.id;
    const { status, priority, search } = req.query;

    let sql = 'SELECT * FROM tasks WHERE user_id = ?';
    const params = [userId];

    if (status && ['pending', 'completed'].includes(status)) {
        sql += ' AND status = ?';
        params.push(status);
    }
    if (priority && ['low', 'medium', 'high'].includes(priority)) {
        sql += ' AND priority = ?';
        params.push(priority);
    }
    if (search) {
        sql += ' AND title LIKE ?';
        params.push(`%${search}%`);
    }

    try {
        const [tasks] = await db.query(sql, params);
        res.json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching tasks.' });
    }
};


/**
 * @desc    Create a new task
 */
exports.createTask = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, priority, due_date } = req.body;
    const userId = req.user.id;

    const sql = 'INSERT INTO tasks (user_id, title, description, priority, due_date) VALUES (?, ?, ?, ?, ?)';
    try {
        const [result] = await db.query(sql, [userId, title, description, priority, due_date]);
        res.status(201).json({ message: 'Task created successfully', taskId: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error creating task.' });
    }
};

//getting a single task using the id
exports.getTaskById = async (req, res) => {
    const taskId = req.params.id;
    const userId = req.user.id;

    try {
        const ownership = await checkTaskOwnership(taskId, userId);
        if (!ownership.exists) {
            return res.status(404).json({ message: 'Task not found.' });
        }
        if (!ownership.isOwner) {
            return res.status(403).json({ message: 'Forbidden. You do not own this task.' });
        }

        const [tasks] = await db.query('SELECT * FROM tasks WHERE id = ?', [taskId]);
        res.json(tasks[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching task.' });
    }
};

//updating an existing task
exports.updateTask = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const taskId = req.params.id;
    const userId = req.user.id;
    const { title, description, priority, status, due_date } = req.body;

    try {
        const ownership = await checkTaskOwnership(taskId, userId);
        if (!ownership.exists) {
            return res.status(404).json({ message: 'Task not found.' });
        }
        if (!ownership.isOwner) {
            return res.status(403).json({ message: 'Forbidden. You cannot update this task.' });
        }
        
        const sql = 'UPDATE tasks SET title = ?, description = ?, priority = ?, status = ?, due_date = ? WHERE id = ?';
        await db.query(sql, [title, description, priority, status, due_date, taskId]);
        
        res.json({ message: 'Task updated successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error updating task.' });
    }
};

//deleting task
exports.deleteTask = async (req, res) => {
    const taskId = req.params.id;
    const userId = req.user.id;

    try {
        const ownership = await checkTaskOwnership(taskId, userId);
        if (!ownership.exists) {
            return res.status(404).json({ message: 'Task not found.' });
        }
        if (!ownership.isOwner) {
            return res.status(403).json({ message: 'Forbidden. You cannot delete this task.' });
        }

        await db.query('DELETE FROM tasks WHERE id = ?', [taskId]);
        res.json({ message: 'Task deleted successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error deleting task.' });
    }
};