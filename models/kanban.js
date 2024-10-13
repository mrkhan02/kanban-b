import { Schema, model } from 'mongoose';

const boardSchema = new Schema({
    name: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

const taskSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    board: { type: Schema.Types.ObjectId, ref: 'Board', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, required: true }
}, { timestamps: true });

const Board = model('Board', boardSchema);
const Task = model('Task', taskSchema);

export { Board, Task };
