import express, { json } from 'express';
import { config } from 'dotenv';
import connectDB from './config/db.js';  // Ensure .js extension is present

// Load environment variables
config();

// Connect to database
connectDB();

// Initialize express app
const app = express();

// Body parser middleware
app.use(json());

// Load routes (convert require to import)
import authRoutes from './routes/auth.js';
import kanbanRoutes from './routes/kanban.js';

app.use('/api/auth', authRoutes);
app.use('/api/kanban', kanbanRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
