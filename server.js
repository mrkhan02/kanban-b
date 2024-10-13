import express, { json } from 'express';
import { config } from 'dotenv';
import cors from 'cors'; // Import CORS middleware
import connectDB from './config/db.js'; // Ensure .js extension is present

// Load environment variables
config();

// Connect to database
connectDB();

// Initialize express app
const app = express();

// Enable CORS for localhost (development environment)
const corsOptions = {
  origin: 'https://taskmate-frontend.vercel.app', // Allow requests from localhost:3000 (React frontend or other clients)
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions)); // Use CORS middleware with specified options

// Body parser middleware
app.use(json());

// Load routes
import authRoutes from './routes/auth.js';
import kanbanRoutes from './routes/kanban.js';

app.use('/api/auth', authRoutes);
app.use('/api/kanban', kanbanRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
