import { createProjectService, getProjectsService, getProjectByIdService, updateProjectService, deleteProjectService } from "../services/project.Service.js";

// Create Project Controller 
export const createProjectController = async (req, res)=>{
    try {
        const { title, description, dueDate, status, progress, teamId } = req.body;
        const project = await createProjectService({ title, description, dueDate, status, progress, teamId });
        res.status(201).json({
            message:"Project created successfully",
            project
        });
    }
    catch (error)
    {
        res.status(400).json({
            message:error.message
        })
    }
}


// Get all Projects Controller 
export const getProjectsController = async (req, res)=>{
    try {
        const projects = await getProjectsService();
        res.status(200).json({
            message:"Projects fetched successfully",
            projects
        });
    }
    catch (error)
    {
        res.status(500).json({
            message:error.message
        })
    }
}


// Get single Project by Id Controller
export const getProjectByIdController = async (req, res)=>{
    try {
        const project = await getProjectByIdService(req.params.id);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        res.status(200).json({
            message:"Project fetched successfully",
            project
        });
    }
    catch (error)
    {
        res.status(500).json({
            message:error.message
        })
    }
}


// Update Project Controller
export const updateProjectController = async (req, res)=>{
    try {
        const { title, description, dueDate, status, progress, teamId } = req.body;
        const updateData = {
            ...(title !== undefined && { title }),
            ...(description !== undefined && { description }),
            ...(dueDate !== undefined && { dueDate }),
            ...(status !== undefined && { status }),
            ...(progress !== undefined && { progress }),
            ...(teamId !== undefined && { teamId })
        };
        const project = await updateProjectService(req.params.id, updateData);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        res.status(200).json({
            message:"Project updated successfully",
            project
        });
    }
    catch (error)
    {
        res.status(400).json({
            message:error.message
        })
    }
}


// Delete Project Controller
export const deleteProjectController = async (req, res)=>{
    try {
        const project = await deleteProjectService(req.params.id);
        res.status(200).json({
            message:"Project deleted successfully",
            project
        });
    }
    catch (error)
    {
        res.status(500).json({
            message:error.message
        })
    }
}