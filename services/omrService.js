// services/omrService.js

import { eq, and } from "drizzle-orm";

import { db } from "../db/index.js";

import {
  MCQExams,
  MCQQuestions,
} from "../db/schema.js";


// ======================================
// CALCULATE OMR RESULT
// ======================================

export const calculateOMRResult = async ({
  examCode,
 setName,
  detectedAnswers,
}) => {

  // ======================================
  // 1. FIND EXAM
  // ======================================

  const exams = await db
    .select()
    .from(MCQExams)
    .where(
      eq(
        MCQExams.examCode,
        examCode
      )
    );

  if (!exams.length) {
    throw new Error(
      `No exam found for exam code: ${examCode}`
    );
  }

  const exam = exams[0];


  // ======================================
  // 2. FIND QUESTIONS
  // ======================================

  const questions = await db
    .select()
    .from(MCQQuestions)
    .where(
      and(
        eq(
          MCQQuestions.examId,
          exam.id
        ),

        eq(
          MCQQuestions.setName,
          setName
        )
      )
    );


  if (!questions.length) {
    throw new Error(
      `No questions found for Exam: ${examCode}, Set: ${ setName}`
    );
  }


  // ======================================
  // 3. CALCULATE
  // ======================================

  let correct = 0;
  let wrong = 0;
  let unanswered = 0;

  const details = [];


  // ======================================
  // 4. CHECK EVERY QUESTION
  // ======================================

  for (const question of questions) {

    const questionNumber =
      Number(question.questionNumber);

 console.log("================================");
  console.log("Question Number:", questionNumber);
  console.log("Detected Answers:", detectedAnswers);
  console.log(
    "Student Answer:",
    detectedAnswers[questionNumber]
  );
    // Student answer
    const studentAnswer =
  detectedAnswers[String(questionNumber)] ??
  detectedAnswers[questionNumber] ??
  detectedAnswers[`q${questionNumber}`] ??
  null;


    // Database correct answer
    const correctAnswer =
      question.correctAnswer;


    let isCorrect = false;

    let status = "unanswered";


    // ====================================
    // UNANSWERED
    // ====================================

    if (!studentAnswer) {

      unanswered++;

      status = "unanswered";

    }


    // ====================================
    // CORRECT
    // ====================================

    else if (
      studentAnswer.toUpperCase() ===
      correctAnswer.toUpperCase()
    ) {

      correct++;

      isCorrect = true;

      status = "correct";

    }


    // ====================================
    // WRONG
    // ====================================

    else {

      wrong++;

      status = "wrong";

    }


    // ====================================
    // DETAIL
    // ====================================

    details.push({

      questionId: question.id,

      questionNumber,

      studentAnswer,

      correctAnswer,

      isCorrect,

      status,

    });

  }


  // ======================================
  // 5. MARKS
  // ======================================

  const MARKS_PER_CORRECT = 1;

  const MARKS_PER_WRONG = 0;

  const marks =
    correct * MARKS_PER_CORRECT +
    wrong * MARKS_PER_WRONG;


  // ======================================
  // 6. RETURN RESULT
  // ======================================

  return {

    examId: exam.id,
  examCode,
  setName,
    totalQuestions: questions.length,

    correct,

    wrong,

    unanswered,

    marks,

    details,

  };

};