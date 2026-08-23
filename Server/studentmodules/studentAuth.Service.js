import bcrypt from "bcrypt";
import Student from "../models/student.Model.js";
import { generateToken } from "../utils/generateToken.js";
import Attendance from "../models/attendence.Model.js";
import { Task } from "../models/taskModel.js";
import Project from "../models/project.Model.js";
import Notification from "../models/notification.Model.js";

// await
// Asynchronous operation complete hone tak wait karta hai.

// Is function ka purpose student ka login verify karna hai.
export const loginStudent = async (email , password)=>{
//    normalizedEmail => frontline denfanse
// const normalizedEmail = String(email || "").trim().toLowerCase();
    const student = await Student.findOne({email});
    if (!student) {
  throw new Error("Invalid email or password");
}
                              //password: user ka bheja hua password.
                              // student.password: database mein saved hashed password.
    const isPasswordCorrect = await bcrypt.compare(password,student.password );
    if(!isPasswordCorrect){
        throw new Error("Invalid Email or Password")
    }
    // generate token
    const token = generateToken(student)
    return{
        token,
        student:{
            id: student._id,
            name: student.name,
            email:student.email,
            rollNumber: student.rollNumber,
            role:"student",
        },
    };

};

// Is function ka purpose current logged-in student ka profile lana hai.
export const getStudentMe = async(studentId)=>{
     
    // MongoDB mein Student collection ke andar is ID wala student find karo.
    const student = await Student.findById(studentId)
    .select("-password")//Database se student find karo, lekin password field response/data mein mat lao.
    // populate: related document ka data bhi lata hai.
    // team_id: student ke andar team ka reference.
    .populate("team_id", "name"); //Mongoose ko bolta hai:
    //team_id ke through related Team document find karo aur uski name bhi le aao.

    if(!student){
        throw new Error("Student not found")
    }
    // Student ka profile controller ko wapas bhej diya jata hai.
    return student;
}


// Is function ka purpose student ki attendance history lana hai.
export const getStudentAttendanceHistory = async(studentId)=>{

    const student = await Student.findById(studentId);
    if(!student){
        throw new Error("Student not found")
    }
                                        //  student_id: studentId: sirf isi student ki attendance.
    const attendance = await Attendance.find({student_id:studentId})
    // -1: descending order.
    .sort({date : -1});//.sort({ date: -1 }): date ke hisaab se latest record pehle.

    return attendance;
}


// Ye function student dashboard ka complete data prepare karta hai.
export const  getStudentDashboard = async(studentId)=>{

    //1. logged-in student database se find karo 
    const student = await Student.findById(studentId)
    .select("-password")
    .populate("team_id", "name")

    if(!student){
        throw new Error("Student not found")
    }

    // sirf ese student k attendace nikalo
    const attendance = await Attendance.find({student_id: studentId});

    //  attendance counts
    const totalDays = attendance.length;
// .filter(): array mein se matching records nikalta hai.
// record: attendance ka ek record.
    const presentDays = attendance.filter((record)=> record.status === "Present").length;
    const absentDays = attendance.filter((record)=> record.status === "Absent").length;
    const leaveDays = attendance.filter((record)=> record.status === "Leave").length;

    // Attendace Percentage
    const attendancePercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0 ;

    // Dashbaord par data rerutn karo
    return{
        student:{
            id: student._id,
      name: student.name,
      email: student.email,
      phone: student.phone,
      rollNumber: student.rollNumber,
      course: student.course,
      batch: student.batch,
      team: student.team_id,
        },
        attendance:{
            totalDays,
            presentDays,
            absentDays,
            leaveDays,
            percentage: attendancePercentage,
        }
    }
}



// Get only logged-in student's tasks
export const getMyTasks = async (studentId) => {
  const tasks =  await Task.find({ studentId })
    // Latest created task pehle show hoga.
    .sort({ createdAt: -1 })
    .lean();
    return tasks;
};

// Ye function task ka status update karta hai.
export const updateMyTaskStatus = async (
  studentId,
  taskId,
  status
) => {
  const allowedStatuses = [
    "Pending",
    "In Progress",
    "Completed",
  ];

// .includes(): check karta hai ke status array mein exist karta hai ya nahi.
  if (!allowedStatuses.includes(status)) {
    throw new Error(
      "Invalid status. Use Pending, In Progress or Completed."
    );
  }

  // IMPORTANT:
  // _id = requested task
  // studentId = logged-in student
  //
  // Iska matlab:
  // student sirf APNA task update kar sakta hai.
  const task = await Task.findOneAndUpdate(
  // Ye security ke liye bohat important hai:
// Task ki ID match honi chahiye.
// Student ki ID bhi match honi chahiye.
// Is se student kisi doosray student ka task update nahi kar sakta.
    {                         
      _id: taskId,
      studentId: studentId,
    },
    // $set: field ki value update karta hai.
    {
      $set: {
        status: status,//status: status: task ka purana status naye status se replace.
      },
    },
    {
      new: true,//new: true: updated task return karo.
      runValidators: true,//runValidators: true: model ke validation rules check karo.
    }
  ).lean();//Updated task ko simple JavaScript object mein convert karta hai.

  if (!task) {
    throw new Error("Task not found");
  }

  return task;
};



// get projects
export const getMyProjects = async (studentId) => {

  // 1. Current student find karo
  const student = await Student.findById(studentId)
  // .select("team_id");

  // 2. Student exist karta hai ya nahi?
  if (!student) {
    throw new Error("Student not found");
  }

  // 3. Student kisi team mein assigned hai ya nahi?
  // Agar student kisi team mein nahi hai to empty array return hoti hai.
  if (!student.team_id) {
    return [];
  }

  // 4. Student ki team ke projects find karo
  const projects = await Project.find({
    // Student ki team_id li jati hai.
// Us team ke projects find kiye jate hain.
// Latest project pehle show hota hai.
    teamId: student.team_id,
  }).sort({ createdAt: -1 });

  return projects;
};

// gets teams
export const getMyTeam = async(studentId)=>{
  // Student ki ID se exactly ek student find karo.
  // Sirf team_id field chahiye.
  const student = await Student.findById(studentId)
  .select("team_id").populate("team_id");

  // Agar student database mein exist nahi karta
  if(!student){
    throw new Error("Student not found")
  }
   // Student exist karta hai lekin team assign nahi hai
  //  Student exist karta hai lekin team assigned nahi hai to null return hota hai.
    if(!student.team_id){
      return null
    }
    // Student ki Team ka data return hota hai.
    return student.team_id;
}

// get notification

export const getMyNotifications = async (studentId) => {

  const notifications = await Notification.find({
    studentId: studentId,
  })
  // Latest notification pehle aati hai.
    .sort({ createdAt: -1 })
    .lean();

  return notifications;
};

// MARK ALL STUDENT NOTIFICATIONS AS READ
export const markAllNotificationsAsRead = async (studentId) => {

  if (!studentId) {
    throw new Error("Student ID is required");
  }
// updateMany: ek se zyada database records update karta hai.
  const result = await Notification.updateMany(
    {
      studentId: studentId,//Jo isi student ki hain.
      read: false,//Jinka read status false hai.
    },
    {
      // Selected notifications ko read mark karta hai.
      $set: {
        read: true,
      },
    }
  );
// Kitni notifications update hui hain, woh count return karta hai.
  return {
    modifiedCount: result.modifiedCount,
  };
};

// Password change karne wala function hai
export const changeStudentPassword = async (studentId,currentPassword,newPassword,confirmPassword)=>{
  
  // 1. Find the student by ID
  const student = await Student.findById(studentId);
  if(!student){
    throw new Error("Student not found");
  }

  // 2. Compare incoming currentPassword with the database password
  const passwordCorrect = await bcrypt.compare(currentPassword, student.password);
// // Purana password ghalat ho to password change nahi hota.
  if(!passwordCorrect){
    throw new Error("Current password is incorrect")
  }

  // 3. Validate new password length
  
  if(!newPassword || newPassword.length < 8){
    throw new Error("New Passowrd must be at least 8 characters");
  }

  //  NEW TYPO CHECK: Confirm new passwords match perfectly
  // New password aur confirm password same hone chahiye
  if(newPassword !== confirmPassword){
    throw new Error("New Passowrd and Confirm password do not match")
  }
// Check karta hai ke naya password purane password jaisa to nahi.
  if(currentPassword === newPassword){
    throw new Error ("New password cannot be the same as your current password")
  }


  // 4. Hash and save the new password
                                //  bcrypt.hash: new password ko secure hash mein convert karta hai.
                                // 10: password security level.
  const hashedPassword = await  bcrypt.hash(newPassword, 10);
  // Student object mein naya hashed password set karta hai.
  student.password = hashedPassword;//hashedPassword: encrypted form.
  await student.save();//Updated student ko database mein save karta hai.

  return true; //Password successfully change hone ka signal return karta hai.
}





























