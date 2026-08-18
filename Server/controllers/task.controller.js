import {
    getAllTasksService,
    getTaskByIdService,
    getTasksByStudentService,
    createTaskService,
    updateTaskService,
    deleteTaskService
} from "../services/task.Service.js";

// @desc    Get all tasks
// @route   GET /api/tasks
export const getTasks = async (req, res) => {
    try {
        const tasks = await getAllTasksService();

        res.status(200).json({
            success: true,
            count: tasks.length,
            data: tasks
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
export const getTask = async (req, res) => {
    try {
        const task = await getTaskByIdService(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        res.status(200).json({
            success: true,
            data: task
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
};

// @desc    Get tasks by student ID
// @route   GET /api/tasks/student/:studentId
export const getTasksByStudent = async (req, res) => {
    try {
        const { studentId } = req.params;
        const tasks = await getTasksByStudentService(studentId);

        res.status(200).json({
            success: true,
            count: tasks.length,
            data: tasks
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
};

// @desc    Create task
// @route   POST /api/tasks
export const createTask = async (req, res) => {
    try {
        const { studentId, title, description, dueDate, status } = req.body;
        const task = await createTaskService({ studentId, title, description, dueDate, status });

        res.status(201).json({
            success: true,
            data: task
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
export const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { studentId, title, description, dueDate, status } = req.body;
        
        const updateData = {
            ...(studentId !== undefined && { studentId }),
            ...(title !== undefined && { title }),
            ...(description !== undefined && { description }),
            ...(dueDate !== undefined && { dueDate }),
            ...(status !== undefined && { status })
        };

        const task = await updateTaskService(id, updateData);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        res.status(200).json({
            success: true,
            data: task
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
export const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await deleteTaskService(id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Task deleted successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
};