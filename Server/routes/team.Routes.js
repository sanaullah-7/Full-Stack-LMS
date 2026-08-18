import express from "express";

import {
    getAllTeams,
    getTeamById,
    createTeam,
    updateTeam,
    deleteTeam,
    addMemberToTeam,
    removeMemberFromTeam,
    removeSelectedMembersFromTeam,
    getTeamByProjectId,
    getUnassignedTeams,
    getUnassignedStudents
} from "../controllers/team.controller.js";

const router = express.Router();


// Get all teams
// GET /api/teams
router.get("/", getAllTeams);


// Get unassigned teams
// GET /api/teams/unassigned
router.get("/unassigned", getUnassignedTeams);


// Get unassigned students
// GET /api/teams/unassigned-students
router.get("/unassigned-students", getUnassignedStudents);


// Get team by project ID
// GET /api/teams/project/:projectId
router.get("/project/:projectId", getTeamByProjectId);


// Create team
// POST /api/teams
router.post("/", createTeam);


// Add member to team
// POST /api/teams/:teamId/members/:studentId
router.post("/:teamId/members/:studentId", addMemberToTeam);


// Remove selected members
// DELETE /api/teams/:teamId/members
router.delete("/:teamId/members", removeSelectedMembersFromTeam);


// Remove one member
// DELETE /api/teams/:teamId/members/:studentId
router.delete("/:teamId/members/:studentId", removeMemberFromTeam);


// Get team by ID
// GET /api/teams/:id
router.get("/:id", getTeamById);


// Update team
// PUT /api/teams/:id
router.put("/:id", updateTeam);


// Delete team
// DELETE /api/teams/:id
router.delete("/:id", deleteTeam);


export default router;