import mongoose from "mongoose";

export const attendanceSchema = new mongoose.Schema({

    student_id:{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Student",
        required:true,

    },
    date:{
        type:Date,
        required:true,
        // No Date.now — day key must come from the selected YYYY-MM-DD
    },
    status:{
        type:String,
        //  Enumeration (yani ek fix list).
        enum:["Present", "Absent", "Leave", "Not marked"],
        default: "Not marked"

    },
    checkInTime:{
        type: String,
        default: "",

    },
    checkOutTime:{
        type : String,
        default: "",

    },
    note:{
        type:String,
        default:"",
        trim :true,

    },
}, {timestamps : true},);

attendanceSchema.index(
    {
        student_id:1,
        date:1
    },
    {
        unique:true
    }

);

const Attendance = mongoose.model("Attendance", attendanceSchema);
export default Attendance;