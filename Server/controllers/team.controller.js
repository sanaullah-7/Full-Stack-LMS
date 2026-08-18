import { Team } from "../models/team.Model.js";
import Student from "../models/student.Model.js";

import {
    getAllTeamsService,
    getTeamByIdService,
    createTeamService,
    updateTeamService,
    deleteTeamService,
    addMemberToTeamService,
    removeMemberFromTeamService,
    removeSelectedMembersFromTeamService,
    getTeamByProjectIdService,
    getUnassignedTeamsService,
    getUnassignedStudentsService
} from "../services/team.Service.js";


// @desc    Get all teams
// @route   GET /api/teams
export const getAllTeams = async (req, res) => {
    try {
        const teams = await getAllTeamsService();

        res.status(200).json({
            success: true,
            data: teams
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// @desc    Get team by ID
// @route   GET /api/teams/:id
export const getTeamById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Team ID is required"
            });
        }

        const team = await getTeamByIdService(id);

        if (!team) {
            return res.status(404).json({
                success: false,
                message: "Team not found"
            });
        }

        res.status(200).json({
            success: true,
            data: team
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// @desc    Create team
// @route   POST /api/teams
// export const createTeam = async (req, res) => {
//     try {
//         const { name, projectId, members } = req.body;

//         if (!name) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Team name is required"
//             });
//         }

//         if (!projectId) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Project ID is required"
//             });
//         }

//         if (members && !Array.isArray(members)) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Members must be an array"
//             });
//         }

//         const team = await createTeamService({
//             name,
//             projectId,
//             members: members || []
//         });

//         res.status(201).json({
//             success: true,
//             data: team
//         });

//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };
export const createTeam = async (req, res) => {
  try {
    const { name, projectId, members, status } = req.body;

    if (!name) {
        return res.status(400).json({
            success: false,
            message: "Team name is required"
        });
    }

    if (members && !Array.isArray(members)) {
        return res.status(400).json({
            success: false,
            message: "Members must be an array"
        });
    }

    const team = await createTeamService({
        name,
        projectId,
        members: members || [],
        status: status || "not_started"
    });

    res.status(201).json({
        success: true,
        data: team
    });

  } catch (error) {
    res.status(500).json({
        success: false,
        message: error.message
    });
  }
};

// @desc    Update team
// @route   PUT /api/teams/:id
export const updateTeam = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, projectId, status } = req.body;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Team ID is required"
            });
        }

        if (!name && !projectId  && !status) {
            return res.status(400).json({
                success: false,
                message: "At least one field is required to update"
            });
        }

        const existingTeam = await Team.findById(id);

        if (!existingTeam) {
            return res.status(404).json({
                success: false,
                message: "Team not found"
            });
        }

        const team = await updateTeamService(id, {
            ...(name !== undefined && { name }),
            ...(projectId !== undefined && { projectId }),
            ...(status !== undefined && { status })
        });

        res.status(200).json({
            success: true,
            data: team
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// @desc    Delete team
// @route   DELETE /api/teams/:id
export const deleteTeam = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Team ID is required"
            });
        }

        const team = await deleteTeamService(id);

        if (!team) {
            return res.status(404).json({
                success: false,
                message: "Team not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Team deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// @desc    Add member to team
// @route   POST /api/teams/:teamId/members/:studentId
export const addMemberToTeam = async (req, res) => {
    try {
        const { teamId, studentId } = req.params;

        if (!teamId || !studentId) {
            return res.status(400).json({
                success: false,
                message: "Team ID and Student ID are required"
            });
        }

        // Check team exists
        const team = await Team.findById(teamId);

        if (!team) {
            return res.status(404).json({
                success: false,
                message: "Team not found"
            });
        }

        // Check student exists
        const student = await Student.findById(studentId);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        // Check student is already in this team
        const alreadyMember = team.members.some(
            member => member.toString() === studentId
        );

        if (alreadyMember) {
            return res.status(400).json({
                success: false,
                message: "Student is already a member of this team"
            });
        }


        const updatedTeam = await addMemberToTeamService(
            teamId,
            studentId
        );

        res.status(200).json({
            success: true,
            data: updatedTeam
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// @desc    Remove member from team
// @route   DELETE /api/teams/:teamId/members/:studentId
export const removeMemberFromTeam = async (req, res) => {
    try {
        const { teamId, studentId } = req.params;

        if (!teamId || !studentId) {
            return res.status(400).json({
                success: false,
                message: "Team ID and Student ID are required"
            });
        }

        const team = await Team.findById(teamId);

        if (!team) {
            return res.status(404).json({
                success: false,
                message: "Team not found"
            });
        }

        const student = await Student.findById(studentId);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        const isMember = team.members.some(
            member => member.toString() === studentId
        );

        if (!isMember) {
            return res.status(400).json({
                success: false,
                message: "Student is not a member of this team"
            });
        }

        const updatedTeam = await removeMemberFromTeamService(
            teamId,
            studentId
        );

        res.status(200).json({
            success: true,
            data: updatedTeam
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// @desc    Remove selected members from team
// @route   DELETE /api/teams/:teamId/members
export const removeSelectedMembersFromTeam = async (req, res) => {
    try {
        const { teamId } = req.params;
        const { studentIds } = req.body;

        if (!teamId) {
            return res.status(400).json({
                success: false,
                message: "Team ID is required"
            });
        }

        if (!Array.isArray(studentIds) || studentIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: "studentIds must be a non-empty array"
            });
        }

        const team = await Team.findById(teamId);

        if (!team) {
            return res.status(404).json({
                success: false,
                message: "Team not found"
            });
        }

        // Check that all selected students are actually members
        const teamMemberIds = team.members.map(member =>
            member.toString()
        );

        const invalidStudentIds = studentIds.filter(
            studentId => !teamMemberIds.includes(studentId)
        );

        if (invalidStudentIds.length > 0) {
            return res.status(400).json({
                success: false,
                message: "One or more students are not members of this team"
            });
        }

        const updatedTeam = await removeSelectedMembersFromTeamService(
            teamId,
            studentIds
        );

        res.status(200).json({
            success: true,
            data: updatedTeam
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// @desc    Get team by project ID
// @route   GET /api/teams/project/:projectId
export const getTeamByProjectId = async (req, res) => {
    try {
        const { projectId } = req.params;

        if (!projectId) {
            return res.status(400).json({
                success: false,
                message: "Project ID is required"
            });
        }

        const team = await getTeamByProjectIdService(projectId);

        if (!team) {
            return res.status(404).json({
                success: false,
                message: "Team not found for this project"
            });
        }

        res.status(200).json({
            success: true,
            data: team
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// @desc    Get unassigned teams
// @route   GET /api/teams/unassigned
export const getUnassignedTeams = async (req, res) => {
    try {
        const teams = await getUnassignedTeamsService();

        res.status(200).json({
            success: true,
            data: teams
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// @desc    Get unassigned students
// @route   GET /api/teams/unassigned-students
export const getUnassignedStudents = async (req, res) => {
    try {
        const students = await getUnassignedStudentsService();

        res.status(200).json({
            success: true,
            data: students
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};