import { getStudentMe, loginStudent,getStudentAttendanceHistory, getStudentDashboard, getMyTasks, updateMyTaskStatus, getMyProjects, getMyTeam, getMyNotifications, changeStudentPassword, markAllNotificationsAsRead } from "./studentAuth.Service.js";
import { unifiedLogin } from "../services/unifiedAuth.Service.js";

export const loginStudentController = async (req , res)=>{
    try {
        const {email, identifier, rollNumber, password} = req.body;
        const loginIdentifier = identifier || email || rollNumber;

        if (!loginIdentifier || !password) {
            return res.status(400).json({
                success: false,
                message: "Roll Number/Email and password are required!",
            });
        }

        const data = await unifiedLogin(loginIdentifier, password);
        return res.status(200).json({
            success: true,
            message: `${data.role === "admin" ? "Admin" : "Student"} Login Successfully`,
            ...data,
        });
    }
     catch (error)
      {
        return res.status(401).json({
            success: false,
            message: error.message || "Invalid credentials",
        });
    }
}

export const getStudentMeController = async ( req,  res)=>{
    try {
                                        // req.student.id=> Ye tumhara middleware provide karta hai.
        const student = await getStudentMe(req.student.id);

        return res.status(200).json({
            success:true,
            message:"Student profile fetched successfully",
            student,
        })
        
    } catch (error) 
    {
        return res.status(404).json({
            success:false,
            message:error.message,
        })
    }
}


export const getMyAttendanceController = async (req , res)=>{
    try {
        // protectStudent middlware nay logged-in stduent ki ID req.student.id ma save ki ha
        const studentId = req.student.id;

        // Service  ko student ID behj  rahe hain.
        const attendance = await getStudentAttendanceHistory(studentId)
        return res.status(200).json({
            success: true,
            message:"My attendance fetched scuessfully!",
            attendance,
        });
    } 
    catch (error) {
        return res.status(404).json({
            success: false,
            message: error.message,
        })
    }
}

//get studnet dashboard data
export const getStudentDashboardController =  async(req, res)=>{
    try {
        // protectStudent middleware se logged-in student ki ID mil rahi hai
        const studentId = req.student.id;

        // service ko student id bejo
        const dashboard = await getStudentDashboard(studentId);

        return res.status(200).json({
            success:true,
            message:"Student dashbaord fetch sucessfully",
            dashboard
        })
 
    } catch (error) 
    {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}





// GET /api/student/tasks
export const getMyTasksController = async (req, res) => {
  try {
    const studentId = req.student.id;

    const tasks = await getMyTasks(studentId);

    return res.status(200).json({
      success: true,
      task: tasks.length,
      tasks,
    });
  } catch (error) {
    // console.error("getMyTasks error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch tasks",
    });
  }
};

// update task status
export const updateMyTaskStatusController = async (req, res) => {
  try {
    // Logged-in student ki ID middleware se milegi
    const studentId = req.student.id;

    // taskId aur new status request body se lo
    const { taskId, status } = req.body;

    // Required fields check
    if (!taskId) {
      return res.status(400).json({
        success: false,
        message: "Task ID is required",
      });
    }

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    // Service ko sirf required data bhejo
    const task = await updateMyTaskStatus(
      studentId,
      taskId,
      status
    );

    return res.status(200).json({
      success: true,
      message: "Task status updated successfully",
      data: task,
    });

  } catch (error) {
    console.error("updateMyTaskStatus error:", error);

    const statusCode =
      error.message === "Task not found" ? 404 : 400;

    return res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to update task",
    });
  }
};


// get project
export const getMyProjectsController = async (req, res) => {
  try {

    const studentId = req.student.id;

    const projects = await getMyProjects(studentId);

    return res.status(200).json({
      success: true,
      message: "Student projects fetched successfully",
      project: projects.length,
      projects,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


// get student tema
export const getMyTeamController = async(req , res)=>{
    try {
         // Middleware ne authenticated student ki information
    // req.student mein save ki thi.
        const studentId = req.student.id;
        // Ab isi student ki ID service ko bhej rahe hain.
        const team = await getMyTeam(studentId)

        return res.status(200).json({
            success:true,
            message:"Student Team fetched successfully",
            team,
        })
        
    } catch (error) {
        return res.status(404).json({
      success: false,
      message: error.message,
    })
    }
}

// get notification

export const getMyNotificationsController = async (req, res) => {
  try {
     const studentId = req.student.id;
    const notifications = await getMyNotifications(studentId);

    return res.status(200).json({
      success: true,
      message: "Student notifications fetched successfully",
      notification: notifications.length,
      notifications,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// mark all notification
export const markAllNotificationsAsReadController = async (
  req,
  res
) => {

  try {

    const studentId = req.student.id;

    const result = await markAllNotificationsAsRead(
      studentId
    );

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read",
      result,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};




export const changeStudentPasswordController = async (req, res) => {
  try {
    //  1. Grab confirmPassword from the request body
    const {currentPassword,newPassword,confirmPassword } = req.body;
const studentId = req.student.id;
    // 2. Make sure all three fields are provided
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // 3. Pass confirmPassword as the 4th argument to your service
    await changeStudentPassword(
      studentId ,
      currentPassword,
      newPassword,
      confirmPassword 
    );

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};




















