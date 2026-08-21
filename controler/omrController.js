// controllers/omrController.js

import { eq } from "drizzle-orm";

import { calculateOMRResult } from "../services/omrService.js";
import { db } from "../db/index.js";
import {
  Students,
  MCQExams,
  OMRSubmissions,
  MCQStudentAnswers,
  MCQResults,
} from "../db/schema.js";

// ======================================
// CHECK MANUAL OMR
// ======================================

export const checkManualOMR = async (req, res) => {
  try {
    const {
      examCode,
      setName,
      answers,
      student,
    } = req.body;
const studentId = req.studentId;
    console.log("=================================");
    console.log("Exam Code:", examCode);
    console.log("Set Name:", setName);
    console.log("Answers:", answers);
    console.log("Student:", student);
    console.log("=================================");

    // ================================
    // VALIDATION
    // ================================

    if (!examCode) {
      return res.status(400).json({
        success: false,
        message: "Exam code is required",
      });
    }

    if (!setName) {
      return res.status(400).json({
        success: false,
        message: "Set name is required",
      });
    }

    if (!answers || typeof answers !== "object") {
      return res.status(400).json({
        success: false,
        message: "Answers are required",
      });
    }

    if (!student) {
      return res.status(400).json({
        success: false,
        message: "Student information is required",
      });
    }

    // ================================
    // ROLL FROM OMR DIGITS
    // ================================

    const rollDigits = student.rollDigits || [];

    const omrRoll = rollDigits
      .filter((digit) => digit !== null && digit !== undefined)
      .join("");

    if (!omrRoll) {
      return res.status(400).json({
        success: false,
        message: "OMR roll number is required",
      });
    }

    console.log("OMR Roll:", omrRoll);

    // ================================
    // FIND STUDENT
    // ================================

    const loggedInStudent = await db
  .select()
  .from(Students)
  .where(eq(Students.id, studentId));

if (loggedInStudent.length === 0) {
  return res.status(404).json({
    success: false,
    message: "Logged-in student not found",
  });
}

const foundStudent = loggedInStudent[0];

    console.log("Found Student:", foundStudent);

    // ================================
    // FIND EXAM
    // ================================

    const examData = await db
      .select()
      .from(MCQExams)
      .where(eq(MCQExams.examCode, examCode.trim()));

    if (examData.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    const exam = examData[0];

    console.log("Found Exam:", exam);

    // ================================
    // CHECK RESULT
    // ================================

    const result = await calculateOMRResult({
      examCode,
      setName,
      detectedAnswers: answers,
    });

    // ================================
    // SAVE OMR SUBMISSION
    // ================================

    const registrationDigits = student.registrationDigits || [];

    const registrationNumber = registrationDigits
      .filter(
        (digit) =>
          digit !== null &&
          digit !== undefined
      )
      .join("");

    const submission = await db
      .insert(OMRSubmissions)
      .values({
        studentId: foundStudent.id,

        examId: exam.id,

        setName,

        rollDigits: omrRoll,

        registrationDigits: registrationNumber || null,
      })
      .returning();

    console.log(
      "OMR Submission Saved:",
      submission[0]
    );


const answerRow=result.details.map((detail)=>({
submissionId:submission[0].id,
selectedAnswer: detail.studentAnswer||null,
studentId: foundStudent.id,
questionId: detail.questionId,
isCorrect:detail.status === "unanswer"? null :detail.isCorrect,

marksObtained:detail.isCorrect ? 1 : 0,


}))

if(answerRow.length > 0){

await db.insert(MCQStudentAnswers).values(answerRow)
}
console.log(
  "Student Answers Saved:",
  answerRow.length
);

const totalMarks=result.totalQuestions;
const obtainedMarks=result.marks

const percentage=totalMarks>0?Math.round((obtainedMarks/totalMarks)*100):0


const saveResult=await db.insert(MCQResults).values({
examId:exam.id,
studentId:foundStudent.id,
submissionId:submission[0].id,
totalQuestions:result.totalQuestions,
correctAnswers:result.correct,
wrongAnswers:result.wrong,
skippedAnswers:result.unanswered,
totalMarks,
obtainedMarks,
percentage









})



    // ================================
    // RESPONSE
    // ================================

    return res.status(200).json({
      success: true,

      examCode,

      setName,

      submissionId: submission[0].id,

      student: {
  id: foundStudent.id,
  name: foundStudent.fullName,
  roll: foundStudent.rollNumber,
},

      result,
    });

  } catch (error) {
    console.error(
      "Manual OMR Check Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "OMR checking failed",
    });
  }
};