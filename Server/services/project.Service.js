import projectModel from "../models/project.Model.js";
import { Team } from "../models/team.Model.js";
import {
  notifyProjectCreated,
  notifyProjectStatusChanged,
  removeNotificationByUniqueKey,
} from "./notification.Service.js";

// create project service
export const createProjectService = async (projectData) => {
    if (projectData.teamId) {
        const teamExists = await Team.findById(projectData.teamId);
        if (!teamExists) {
            throw new Error("Referenced team does not exist");
        }
    }
    const project = await projectModel.create(projectData);
    await notifyProjectCreated(project);
    if (project.teamId) {
        await removeNotificationByUniqueKey(`TEAM:no_project:${project.teamId}`);
    }
    return project;
}


// get all projects service
// export const getProjectsService = async () => {
//     const projects = await projectModel.find();
//     return projects;
// }
export const getProjectsService = async () => {
    const projects = await projectModel.find().populate("teamId");
    return projects;
}


// get single project by Id service
// export const getProjectByIdService = async (id) => {
//     const project = await projectModel.findById(id);
//     return project;
// }
export const getProjectByIdService = async (id) => {
    const project = await projectModel.findById(id).populate("teamId");
    return project;
}


// update project service
export const updateProjectService = async (id, projectData) => {
    if (projectData.teamId) {
        const teamExists = await Team.findById(projectData.teamId);
        if (!teamExists) {
            throw new Error("Referenced team does not exist");
        }
    }
    const previous = await projectModel.findById(id);
    const project = await projectModel.findByIdAndUpdate(id, projectData, { new: true });
    if (previous && project) {
        await notifyProjectStatusChanged(project, previous.status);
        if (project.teamId) {
            await removeNotificationByUniqueKey(`TEAM:no_project:${project.teamId}`);
        }
    }
    return project;
}


// delete project service
export const deleteProjectService = async (id) => {
    const project = await projectModel.findByIdAndDelete(id);
    return project;
}

