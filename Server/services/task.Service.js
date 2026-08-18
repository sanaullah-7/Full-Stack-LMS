import { Task } from "../models/taskModel.js";
import Student from "../models/student.Model.js";
import {
  notifyTaskCreated,
  notifyTaskUpdated,
} from "./notification.Service.js";

const studentPopulate = {
    path: "studentId",
    select: "name rollNumber team_id",
    populate: { path: "team_id", select: "name" },
};

// @desc    Get all tasks from database
export const getAllTasksService = async () => {
    return await Task.find().populate(studentPopulate).sort({ createdAt: -1 });
};

// @desc    Get single task by ID
export const getTaskByIdService = async (id) => {
    return await Task.findById(id).populate(studentPopulate);
};

// @desc    Get tasks belonging to a specific student
export const getTasksByStudentService = async (studentId) => {
    return await Task.find({ studentId }).populate(studentPopulate);
};

// @desc    Create a new task
export const createTaskService = async (taskData) => {
    const { studentId, title, description, dueDate, status } = taskData;

    // Basic validation
    if (!studentId || !title) {
        throw new Error("Student ID and task title are required");
    }

    const studentExists = await Student.findById(studentId);
    if (!studentExists) {
        throw new Error("Referenced student does not exist");
    }

    const task = await Task.create({
        studentId,
        title,
        description,
        dueDate,
        status
    });

    const populated = await Task.findById(task._id).populate(studentPopulate);
    await notifyTaskCreated(populated, studentExists);
    return populated;
};

// @desc    Update task by ID
export const updateTaskService = async (id, updateData) => {
    let assignee = null;
    if (updateData.studentId) {
        assignee = await Student.findById(updateData.studentId);
        if (!assignee) {
            throw new Error("Referenced student does not exist");
        }
    }

    const previous = await Task.findById(id);
    const task = await Task.findByIdAndUpdate(
        id,
        updateData,
        {
            new: true,
            runValidators: true
        }
    );

    if (!task) return null;
    const populated = await Task.findById(task._id).populate(studentPopulate);
    if (!assignee && populated?.studentId) {
        assignee = populated.studentId;
    }
    await notifyTaskUpdated(populated, previous, assignee);
    return populated;
};

// @desc    Delete task by ID
export const deleteTaskService = async (id) => {
    const task = await Task.findByIdAndDelete(id);
    return task;
};
