import mongoose from "mongoose";

/**
 * Persistent admin notifications generated from real LMS events / derived state.
 * uniqueKey prevents duplicate derived notifications (deadlines, daily attendance summaries).
 */
const notificationSchema = new mongoose.Schema(
  {
      studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      default: null,
      index: true,
    },
    type: {
      type: String,
      enum: ["STUDENT", "ATTENDANCE", "TEAM", "PROJECT", "TASK"],
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    read: {
      type: Boolean,
      default: false,
      index: true,
    },
    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    relatedType: {
      type: String,
      enum: ["Student", "Attendance", "Team", "Project", "Task"],
      default: undefined,
    },
    /** Stable identity for upsert / duplicate prevention (e.g. TASK:overdue:<id>:<ymd>) */
    uniqueKey: {
      type: String,
      default: null,
      sparse: true,
      unique: true,
      index: true,
    },
  },
  { timestamps: true },
);

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
