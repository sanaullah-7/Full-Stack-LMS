import { Team } from "../models/team.Model.js";
import Student from "../models/student.Model.js";
import Project from "../models/project.Model.js";
import {
  notifyTeamCreated,
  notifyMemberAddedToTeam,
  notifyStudentTeamChange,
} from "./notification.Service.js";

// @desc get all teams

// export const getAllTeamsService = async () => {
//     return await Team.find().populate("members");
// }
export const getAllTeamsService = async () => {
    const teams = await Team.find().populate("members").lean();
    const projects = await Project.find({ teamId: { $in: teams.map(t => t._id) } }).lean();

    const projectsByTeam = {};
    projects.forEach(p => {
        const tid = p.teamId.toString();
        if (!projectsByTeam[tid]) projectsByTeam[tid] = [];
        projectsByTeam[tid].push(p);
    });

    

    const result = await Promise.all(
        teams.map(async(team)=>{

            const projects = await Project.find({
                teamId: team._id
            });

            return {
                ...team,
                projects
            };

        })
    );

    return result;
}

// @desc get team by id

// export const getTeamByIdService = async (id) => {
//     return await Team.findById(id).populate("members");
// }
export const getTeamByIdService = async (id) => {
    const team = await Team.findById(id)
        .populate("members")
        .lean();

    if (!team) return null;

    const projects = await Project.find({
        teamId: id
    });

    return {
        ...team,
        projects
    };
};
// @desc create team

export const createTeamService = async (teamData) => {
    const team = await Team.create(teamData);
    if (teamData.members && teamData.members.length > 0) {
        await Student.updateMany({ _id: { $in: teamData.members } }, { team_id: team._id });
    }
    await notifyTeamCreated(team);
    if (teamData.members && teamData.members.length > 0) {
        const members = await Student.find({ _id: { $in: teamData.members } }).select("name");
        for (const member of members) {
            await notifyMemberAddedToTeam(team, member);
            await notifyStudentTeamChange(member, team);
        }
    }
    return team;
}

// @desc update team

export const updateTeamService = async (id, teamData) => {
    return await Team.findByIdAndUpdate(id, teamData, { new: true, runValidators: true });
}

// @desc delete team

export const deleteTeamService = async (id) => {
    const team = await Team.findByIdAndDelete(id);
    if (team) {
        // Reset team_id for all students in this team
        await Student.updateMany({ team_id: id }, { team_id: null });
        // Reset teamId for all projects assigned to this team
        await Project.updateMany({ teamId: id }, { teamId: null });
    }
    return team;
}

// @desc add members to team
export const addMemberToTeamService = async (teamId, studentId) => {
    const student = await Student.findById(studentId).select("name team_id");
    if (!student)
        throw new Error("Student not found");
    if (student.team_id) throw new Error("Student is already assigned to a team!");

    // Only update team_id — do not re-validate unrelated fields (e.g. legacy students without email)
    await Student.findByIdAndUpdate(
        studentId,
        { team_id: teamId },
        { runValidators: false },
    );

    const team = await Team.findByIdAndUpdate(
        teamId,
        {
            $addToSet: {
                members: studentId
            }
        },
        {
            new: true,
            runValidators: true
        }
    ).populate("members");

    if (team) {
        await notifyMemberAddedToTeam(team, student);
        await notifyStudentTeamChange(student, team);
    }
    return team;
};


// @desc remove member from team

export const removeMemberFromTeamService = async (teamId, studentId) => {
    await Student.findByIdAndUpdate(studentId, { team_id: null });

    return await Team.findByIdAndUpdate(
        teamId,
        {
            $pull: {
                members: studentId
            }
        },
        {
            new: true,
            runValidators: true
        }
    ).populate("members");
};

// @desc    remove  selected   members from team

export const removeSelectedMembersFromTeamService = async (teamId, studentIds) => {
    await Student.updateMany(
        { _id: { $in: studentIds } },
        { team_id: null }
    );

    return await Team.findByIdAndUpdate(
        teamId,
        {
            $pull: {
                members: { $in: studentIds }
            }
        },
        {
            new: true,
            runValidators: true
        }
    ).populate("members");
};

// @desc    get team by project id

export const getTeamByProjectIdService = async (projectId) => {
    return await Team.findOne({ projectId }).populate("members");
}

// @desc    get unassigned teams

export const getUnassignedTeamsService = async () => {
    return await Team.find({ members: { $size: 0 } }).populate("members");
}

// @desc    get unassigned students from all teams

export const getUnassignedStudentsService = async () => {
    return await Student.find({
        $or: [{ team_id: null }, { team_id: { $exists: false } }]
    });
};