import {
  createStudent,
  getStudents,
  getStudentById,
  getStudentProfile,
  updateStudent,
  deleteStudent,
} from "../services/student.Service.js";

// CREATE STUDENT
export const createStudentController = async (req, res) => {
  
  try {
    const student = await createStudent(req.body);
    res.status(201).json({ message: "Student Created successfully", student });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET ALL STUDENTS
export const getStudentController = async (req, res) => {
  try {
    const students = await getStudents(req.query);
    res.status(200).json({
      message: "Students fetched successfully",
      students,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET STUDENT PROFILE (dynamic aggregate)
export const getStudentProfileController = async (req, res) => {
  try {
    const data = await getStudentProfile(req.params.id);
    res.status(200).json({
      success: true,
      message: "Student profile fetched successfully",
      data,
    });
  } catch (error) {
    const status = error.message === "Student not found!" ? 404 : 500;
    res.status(status).json({
      success: false,
      message: error.message,
    });
  }
};

// GET SINGLE STUDENT by id
export const getStudentByIdController = async (req, res) => {
  try {
    const student = await getStudentById(req.params.id);
    res.status(200).json({
      message: "Student fetched successfully!",
      student,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// update student
export const updateStudentController = async (req, res) => {
  try {
    const student = await updateStudent(req.params.id, req.body);
    res.status(200).json({
      message: "Student updated successfully!",
      student,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delte Student
export const deleteStudentController = async (req, res) => {
  try {
    await deleteStudent(req.params.id);
    res.status(200).json({
      message: "Student deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      errorMessage: error.message,
    });
  }
};
