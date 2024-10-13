import { Board, Task } from '../models/kanban.js';

// Get all boards
export async function getBoards(req, res) {
    try {
        // Find boards for the authenticated user and use .lean() for better performance
        const boards = await Board.find({ user: req.user.id }).lean(); 
        
        // Prepare an array to hold the results
        const results = await Promise.all(boards.map(async (board) => {
            const todoCount = await Task.countDocuments({ board: board._id, status: 'todo' });
            const inProcessCount = await Task.countDocuments({ board: board._id, status: 'inProcess' });
            const completedCount = await Task.countDocuments({ board: board._id, status: 'completed' });

            return {
                ...board, // Directly spread the plain object properties
                tasks: {
                    todo: todoCount,
                    inProcess: inProcessCount,
                    completed: completedCount,
                },
            };
        }));

        res.status(200).json(results);
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: 'Server Error' });
    }
}



// Get single board
export async function getBoard(req, res) {
    const board = await Board.findById(req.params.id);
    if (!board) {
        return res.status(404).json({ message: 'Board not found' });
    }
    const todoCount = await Task.countDocuments({ board: board._id, status: 'todo' });
    const inProcessCount = await Task.countDocuments({ board: board._id, status: 'inProcess' });
    const completedCount = await Task.countDocuments({ board: board._id, status: 'completed' });
    const tasks = { todo: todoCount, inProcess: inProcessCount, completed: completedCount };
    res.status(200).json({ ...board.toObject(), tasks });
}

// Create new board
export async function createBoard(req, res) {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ message: 'Board name is required' });
    }

    try {
        // Check if board exists
        const boardExists = await Board.findOne({ name , user: req.user.id });
        if (boardExists) {
            return res.status(400).json({ message: 'Board already exists' });
        }

        // Create new board
        const board = new Board({
            name,
            user: req.user.id
        });

        await board.save(); 

        res.status(201).json(board);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
}

// Update board
export async function updateBoard(req, res) {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ message: 'Board name is required' });
    }

    try {
        const board = await Board.findById(req.params.id);
        if (!board) {
            return res.status(404).json({ message: 'Board not found' });
        }

        // Check if board exists
        const boardExists = await Board.findOne({ name, user: req.user.id });
        if (boardExists) {
            return res.status(400).json({ message: 'Board already exists' });
        }

        // Update board
        board.name = name;
        await board.save();

        res.status(200).json(board);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
}

// Delete board
export async function deleteBoard(req, res) {
    try {
        const board = await Board.findById(req.params.id);
        if (!board) {
            return res.status(404).json({ message: 'Board not found' });
        }

        await Task.deleteMany({ board: board._id });
        await board.remove();   

        res.status(200).json({ message: 'Board deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
}

// search by name 
export async function searchBoard(req, res) {
    try {
        const boards = await Board.find({ name: new RegExp(req.params.name, 'i') });

        // Prepare an array to hold the results
        const results = await Promise.all(boards.map(async (board) => {
            const todoCount = await Task.countDocuments({ board: board._id, status: 'todo' });
            const inProcessCount = await Task.countDocuments({ board: board._id, status: 'inProcess' });
            const completedCount = await Task.countDocuments({ board: board._id, status: 'completed' });

            return {
                ...board, // Directly spread the plain object properties
                tasks: {
                    todo: todoCount,
                    inProcess: inProcessCount,
                    completed: completedCount,
                },
            };
        }));

        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
}