import { Router } from 'express';
import { getBoards, getBoard, createBoard, updateBoard, deleteBoard } from '../controllers/boardController.js';
import { getTasks, getTask, createTask, updateTask, deleteTask } from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();
// board
// Get all boards
router.get('/', protect, getBoards);
// Get single board
router.get('/:id', protect, getBoard);
// Create new board
router.post('/', protect, createBoard);
// Update board
router.put('/:id', protect, updateBoard);
// Delete board
router.delete('/:id', protect, deleteBoard);

// tasks
// Get all tasks
router.get('/:boardId/tasks', protect, getTasks);
// Get single task
router.get('/:boardId/tasks/:id', protect, getTask);
// Create new task
router.post('/:boardId/tasks', protect, createTask);
// Update task
router.put('/:boardId/tasks/:id', protect, updateTask);
// Delete task
router.delete('/:boardId/tasks/:id', protect, deleteTask);

export default router;
