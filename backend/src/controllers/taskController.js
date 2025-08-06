const db = require('../config/db');
const { validationResult } = require('express-validator');

// Helper function to check task ownership
const checkTaskOwnership = async (taskId, userId) => {
    const { rows } = await db.query('SELECT user_id FROM tasks WHERE id = $1', [taskId]);
    if (rows.length === 0) {
      return { exists: false, isOwner: false };
    }
    return { exists: true, isOwner: rows[0].user_id === userId };
};

exports.getTasks = async (req, res) => {
    const userId = req.user.id;
    const { status, priority, search } = req.query;

    let sql = 'SELECT * FROM tasks WHERE user_id = $1';
    const params = [userId];
    let paramIndex = 2;

    if (status && ['pending', 'completed'].includes(status)) {
        sql += ` AND status = $${paramIndex++}`;
        params.push(status);
    }
    if (priority && ['low', 'medium', 'high'].includes(priority)) {
        sql += ` AND priority = $${paramIndex++}`;
        params.push(priority);
    }
    if (search) {
        sql += ` AND title ILIKE $${paramIndex++}`; // ILIKE is case-insensitive in Postgres
        params.push(`%${search}%`);
    }

    sql += ' ORDER BY created_at DESC';

    try {
        const { rows } = await db.query(sql, params);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching tasks.' });
    }
};

exports.createTask = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, priority, due_date } = req.body;
    const userId = req.user.id;

    const sql = 'INSERT INTO tasks (user_id, title, description, priority, due_date) VALUES ($1, $2, $3, $4, $5) RETURNING id';
    try {
        const { rows } = await db.query(sql, [userId, title, description || null, priority || 'medium', due_date || null]);
        res.status(201).json({ message: 'Task created successfully', taskId: rows[0].id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error creating task.' });
    }
};

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

        const { rows } = await db.query('SELECT * FROM tasks WHERE id = $1', [taskId]);
        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching task.' });
    }
};

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
        
        const sql = 'UPDATE tasks SET title = $1, description = $2, priority = $3, status = $4, due_date = $5, updated_at = NOW() WHERE id = $6';
        await db.query(sql, [title, description, priority, status, due_date, taskId]);
        
        res.json({ message: 'Task updated successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error updating task.' });
    }
};

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

        await db.query('DELETE FROM tasks WHERE id = $1', [taskId]);
        res.json({ message: 'Task deleted successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error deleting task.' });
    }
};