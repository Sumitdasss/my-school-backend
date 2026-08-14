import {db} from "../db/index.js"
import { MCQExams,MCQQuestions } from "../db/schema.js"

export const  ADDMCQexam=async (req,res)=>{
try{
const {examName,
      subject,
      className,
      section,
      totalMarks,
      duration,
      examDate,
      questions,}=req.body

        if (!examName || !subject || !className) {
      return res.status(400).json({
        message: "Exam name, subject and class are required",
      });
    }
  if (!totalMarks || !duration) {
      return res.status(400).json({
        message: "Total marks and duration are required",
      });
    }
  if (
      !Array.isArray(questions) ||
      questions.length === 0
    ) {
      return res.status(400).json({
        message: "At least one question is required",
      });
    }
  const [exam] = await db
      .insert(MCQExams)
      .values({
        examName,
        subject,
        className,
        section: section || null,
        totalMarks: Number(totalMarks),
        duration: Number(duration),
        examDate: examDate || null,
        isActive: true,
      })
      .returning();

  const questionValues = questions.map(
      (question, index) => ({
        examId: exam.id,

        questionNumber: index + 1,

        question: question.question,

        optionA: question.optionA,

        optionB: question.optionB,

        optionC: question.optionC,

        optionD: question.optionD,
         setName: question.setName,

        correctAnswer: question.correctAnswer,

        marks: Number(question.marks || 1),
      })
    );


 const createdQuestions = await db
      .insert(MCQQuestions)
      .values(questionValues)
      .returning();

return res.status(201).json({
      success: true,

      message: "MCQ exam created successfully",

      exam,

      questions: createdQuestions,
    });
}catch(err){
  console.err(
      "CREATE MCQ EXAM ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to create MCQ exam",
      error: error.message,
    });
}


}


export const ShowExamquction=async(req,res)=>{
    try{

  const exams = await db
      .select()
      .from(MCQExams);

    return res.json({
      success: true,
      exams,
    });

    }catch(err){
    console.err(
      "GET MCQ EXAMS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch MCQ exams",
    });

    }
}



export const GETExamquction=async(req,res)=>{
    try {

    const examId = Number(req.params.id);

    if (!examId) {
      return res.status(400).json({
        message: "Invalid exam ID",
      });
    }


    const exams = await db
      .select()
      .from(MCQExams)
      .where(
        eq(MCQExams.id, examId)
      );


    if (exams.length === 0) {
      return res.status(404).json({
        message: "Exam not found",
      });
    }


    const questions = await db
      .select()
      .from(MCQQuestions)
      .where(
        eq(MCQQuestions.examId, examId)
      );


    return res.json({
      success: true,
      exam: exams[0],
      questions,
    });

  } catch (error) {

    console.error(
      "GET MCQ EXAM ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch exam",
    });
  } 
}
