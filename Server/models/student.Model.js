import mongoose from "mongoose";


// Schema means:
// Database mein Student ka structure kaisa hoga
const studentSchema = new mongoose.Schema({

    // We are creating a field called rollNumber
    rollNumber: {
        type: String,       // Roll number is a string.
        required: true,     // Roll number must be provided.
        unique: true,       // Two students cannot have the same roll number.
        min:100000,
        max:999999,
        trim: true,
        index: true,//An index helps MongoDB find roll numbers faster.
    },

    // We are creating a field called name
    name: {
        type: String,       // Name is a string.
        required: true,     // Name must be provided.
        trim:true,
    },

    email: {
        type: String,
        required: [true, "Email is required."],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Please provide a valid email."],
    },

    // Optional contact number — empty string when not provided
    phone: {
        type: String,
        default: "",
        trim: true,
    },

    // We are creating a field called course
    course: {
        type: String,       // Course is a string.
        required: true,     // Course must be provided.
        trim:true,
    },

    // We are creating a field called batch
    batch: {
        type: String,       // Batch is a string.
        required: true,     // Batch must be provided.
    },

    // We are creating a relationship with Team
    team_id: {
        type: mongoose.Schema.Types.ObjectId,// team_id ke andar Team ki MongoDB ObjectId store hogi.
        ref: "Team", //: This tells Mongoose that this ObjectId belongs to the Team model.
        default:null,//If studetn have no team is assigned, the value will be null.
    },
    
    password:{
        type:String,
        required:true,
        minlength:8,
    },

},
{
    timestamps: true,
    // Mongoose automatically createdAt aur updatedAt add karega.
});
// Index MongoDB ko roll number jaldi search karne mein help karta hai.

// We create a Mongoose model named Student using studentSchema.
const Student = mongoose.model("Student", studentSchema);


// Other files mein Student model use karne ke liye export kar rahe hain.
export default Student;
