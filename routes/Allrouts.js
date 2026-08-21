import express from "express";
import { studentRegister } from "../controler/studentregistarcontroler.js";
import { ParentRegister } from "../controler/parentregister.js";
import { TeacherRegister } from "../controler/Teacherregistar.js";
import { getDashboardData } from "../controler/Deshbordd.js";
import { getSubjects,
addSubject,
deleteSubject } from "../controler/subjectController.js";
import { addResult,
getResults,
deleteResult } from "../controler/resultController.js";
import { getAssignments,
addAssignment,
deleteAssignment } from "../controler/teacherAssignmentController.js";
import { getExams,
addExam,
deleteExam } from "../controler/examController.js";
import { 
getStudents,
getStudentFilters,
deleteStudent
} from "../controler/studentController.js";
import { 
ADDMCQexam,
GETExamquction,
ShowExamquction
} from "../controler/MCQExamcontoraler.js";
import { 
getMCQQuestions,
createMCQQuestion,
deleteMCQQuestion,
getMCQExams
} from "../controler/mcqQuestionController.js";
import { 
getStudentById,
updateStudent,
deleteStudent1122

} from "../controler/Studentloging.js";
import {adminLogin} from "../controler/adminController.js"
import {resetPassword,verifyOTP,sendOTP} from "../controler/passwordController.js"
const router = express.Router();
import upload from "../middleware/upload.js";

import { checkManualOMR } from "../controler/omrController.js";
import { studentAuth } from "../middleware/studentAuth.js";
import { getAllMCQResults,deleteMCQResult } from "../controler/mcqResultController.js";
router.post("/register", upload.single("photo"), studentRegister);
router.post("/Parentregister123", upload.single("photo"), ParentRegister);
router.post("/Teacherregister123", upload.single("photo"), TeacherRegister);
router.get("/dashboard", getDashboardData);
router.get("/subshow", getSubjects);
router.post("/subadd", addSubject);
router.delete("/subdelet/:id", deleteSubject);
router.post("/resultshow", getResults);
router.post("/resultadd", addResult);
router.delete("/resultdelet/:id", deleteResult);
router.get("/Assing-Teacher-show", getAssignments);
router.post("/Assing-Teacher-add", addAssignment);
router.delete("/Assing-Teacher-delet/:id", deleteAssignment);
router.get("/Getexam", getExams);
router.post("/Addexam", addExam);
router.delete("/Deletexam/:id", deleteExam);
router.get("/allStudent",getStudents)
router.get("/allStudent-filter",getStudentFilters)
router.delete("/Studentdelet/:id",deleteStudent)
router.post("/Addmcq",ADDMCQexam)
router.get("/ShowMcquction",ShowExamquction)
router.get("/Filtermcq",GETExamquction)
router.get("/getquction",getMCQQuestions)
router.get("/getmcqexam",getMCQExams)
router.post("/postquction",createMCQQuestion)
router.delete("/deletquction/:id",deleteMCQQuestion)
router.get("/getstudentlogindeta",getStudentById)
router.put("/putstudentprofile/:id", upload.single("photo"),   updateStudent)
router.delete("/deletstudentprofile/:id",deleteStudent1122)
router.post("/sent-otp",sendOTP)
router.post("/verifay-opt",verifyOTP)
router.post("/resetpassword",resetPassword)
router.post("/admin",adminLogin)
router.post("/cheak",studentAuth, checkManualOMR)
router.get("/getmcqresult",getAllMCQResults)
router.delete("/deletmcqresult/:id",deleteMCQResult)

export default router;