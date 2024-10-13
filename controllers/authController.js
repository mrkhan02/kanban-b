// controllers/authController.js
import User from '../models/User.js';
import pkg from 'jsonwebtoken';
const { sign } = pkg;
import bcrypt from 'bcryptjs';

const { genSalt, hash, compare } = bcrypt;

// Register a new user
export async function registerUser(req, res) {
    const { name, email, password } = req.body;
    
    try {
        // Check if user exists
        const userExists = await User.findOne({ email });  // Corrected to use User model
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await genSalt(10);
        const hashedPassword = await hash(password, salt);

        // Create new user
        const user = new User({
            name,
            email,
            password: hashedPassword
        });

        await user.save();

        // Create token
        const token = sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.status(201).json({ token });
    } catch (error) {
        console.error(error); // Log error for debugging
        res.status(500).json({ message: 'Server Error' });
    }
}

// Login user
export async function loginUser(req, res) {
    const { email, password } = req.body;
    
    try {
        const user = await User.findOne({ email });  // Corrected to use User model
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.status(200).json({ token });
    } catch (error) {
        console.error(error); // Log error for debugging
        res.status(500).json({ message: 'Server Error' });
    }
}
