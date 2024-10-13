import { Board, Task } from '../models/kanban.js';

// Get all tasks
export async function getTasks(req, res) {
    const tasks = await Task.find({ board: req.params.boardId, user: req.user.id });
    res.status(200).json(tasks);
}

// Get single task
export async function getTask(req, res) {
    const task = await Task.findById(req.params.id);
    if (!task) {
        return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json(task);
}

// Create new task
export async function createTask(req, res) {
    const { title, description, status } = req.body;
    if (!title || !description || !status) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const task = new Task({
            title,
            description,
            status,
            board: req.params.boardId,
            user: req.user.id
        });

        await task.save();

        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
}

// Update task
export async function updateTask(req, res) {
    const { title, description, status } = req.body;
    // at leat one  of three required
    if (!title && !status && !description) {
        return res.status(400).json({ message: 'At least one field are required' });
    }

    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        task.title = title || task.title;
        task.description = description || task.description;
        task.status= status || task.status

        await task.save();

        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
}    

// Delete task
export async function deleteTask(req, res) {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        await Task.deleteOne({ _id: req.params.id });   

        res.status(200).json({ message: 'Task deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
}