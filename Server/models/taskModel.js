import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: [true, 'Student ID is required']
    },
    title: {
        type: String,
        required: [true, 'Task title is required']
    },
    description: {
        type: String
    },
    dueDate: {
        type: Date
    },
    status: {
        type: String,
        enum: ['pending', 'in_progress', 'completed', 'Pending', 'In Progress', 'Completed'],
        default: 'pending'
    }

}, {timestamps: true});

export const Task = mongoose.model("Task", taskSchema);
