import {
    getAttencdanceByDate,
    getOverAllAttendanceStatus,
    getStudentAttendacehistory,
    markAttendance,
} from "../services/attendance.Service.js";


// Mark Attendance
export const markAttendanceController = async(req , res) => {
    try {
         const {students , date} = req.body;
         if(!date){
            return res.status(400).json({
                message: "Date is required"
            })
         }
         if(!students || !Array.isArray(students))
         {
            return res.status(400).json({
                message: "Student array is required!"
            })
         }

         const attendance = await markAttendance( students, date);
         res.status(200).json({
            message:"Attendance marked successfully",
            attendance
         })
         
    } 
    catch (error) 
    {
        res.status(500).json({
            message: error.message
        })
    }
}

// GET ATTENDANCE BY DATE
export const getAttendanceByDateController = async(req, res) =>{
    try {

        const {date} = req.params;
        const attendance = await getAttencdanceByDate(date);
        res.status(200).json({
            message: "Attendance fetched successfully",
            attendance
        })
        
    } catch (error) {
         res.status(500).json({
            message: error.message
        })
    }
}

// STUDENT ATTENDANCE HISTORY
export const getStudentAttendanceHistoryController = async (req , res)=>{
    try {
        const {studentId} = req.params;
        // console.log("STUDENT ID:", studentId);

        const attendance = await getStudentAttendacehistory(studentId);

        res.status(200).json({
            message : "Student attendance history fetched successfully",
            attendance,
        })
        
    }
     catch (error) 
     {
        res.status(500).json({
            message: error.message
        })
    }
}

// OVERALL ATTENDANCE Status
export const getOverallAttendanceStatusController =  async (req , res) => {
    try {
        const stats = await getOverAllAttendanceStatus();
        res.status(200).json({
            message: "Overall attendance statistics fetched successfully",
             stats,
               });
               
    } 
    catch (error)
     {
        res.status(500).json({
            message: error.message
        })
    }
    
}