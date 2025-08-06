const express = require('express');
const { body, param } = require('express-validator');
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

//All task related routes are defined here
router.use(authMiddleware);

// GET 
router.get('/', taskController.getTasks);

//POST
router.post(
  '/',
  [
    body('title', 'Title is required').not().isEmpty().trim().escape(),
    body('description').optional().trim().escape(),
    body('priority').optional().isIn(['low', 'medium', 'high']),
    body('due_date').optional({ checkFalsy: true }).isISO8601().toDate(),
  ],
  taskController.createTask
);

// GET
router.get(
  '/:id',
  [param('id', 'Task ID must be an integer').isInt()],
  taskController.getTaskById
);

//PUT
router.put(
  '/:id',
  [
    param('id', 'Task ID must be an integer').isInt(),
    body('title', 'Title is required').not().isEmpty().trim().escape(),
    body('description').optional().trim().escape(),
    body('status').optional().isIn(['pending', 'completed']),
    body('priority').optional().isIn(['low', 'medium', 'high']),
    body('due_date').optional({ checkFalsy: true }).isISO8601().toDate(),
  ],
  taskController.updateTask
);

//DELETE
router.delete(
  '/:id',
  [param('id', 'Task ID must be an integer').isInt()],
  taskController.deleteTask
);

module.exports = router;