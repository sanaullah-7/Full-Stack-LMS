import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Project name is required'] 
    },
    teamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        default: null
    },
    description:{
        type: String
    },
    dueDate:{
        type: Date,
    },
    status:{
        type: String,
        enum: ['Not Started', 'In Progress', "Under Review", 'Completed'],
        default: 'Not Started'
    },
    progress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
},{timestamps:true})


export default mongoose.model("Project", projectSchema)
