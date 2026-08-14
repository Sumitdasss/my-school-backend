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

const router = express.Router();
import upload from "../middleware/upload.js";

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

export default router;