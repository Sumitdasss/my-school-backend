import { db } from "../db/index.js";

import {
  MCQQuestions,MCQExams
} from "../db/schema.js";

import { eq,desc } from "drizzle-orm";


// ======================================
// GET QUESTIONS
// ======================================

export const getMCQQuestions = async (req, res) => {

  try {

    const { examId } = req.query;

    let questions;

    if (examId) {

      questions = await db
        .select()
        .from(MCQQuestions)
        .where(
          eq(
            MCQQuestions.examId,
            Number(examId)
          )
        );

    } else {

      questions = await db
        .select()
        .from(MCQQuestions);

    }

    return res.status(200).json({

      success: true,

      data: questions,

    });

  } catch (error) {

    console.error(
      "GET MCQ ERROR:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Failed to fetch MCQ questions",

    });

  }

};


// ======================================
// CREATE QUESTION
// ======================================

export const createMCQQuestion = async (
  req,
  res
) => {

  try {

    const {

      examId,

      setName,

      questionNumber,

      question,

      optionA,

      optionB,

      optionC,

      optionD,

      correctAnswer,

      marks,

    } = req.body;


    if (

      !examId ||

      !questionNumber ||

      !question ||

      !optionA ||

      !optionB ||

      !optionC ||

      !optionD ||

      !correctAnswer

    ) {

      return res.status(400).json({

        success: false,

        message:
          "All required fields are required",

      });

    }


    const result = await db

      .insert(MCQQuestions)

      .values({

        examId: Number(examId),

        setName: setName || "A",

        questionNumber:
          Number(questionNumber),

        question,

        optionA,

        optionB,

        optionC,

        optionD,

        correctAnswer:
          correctAnswer.toUpperCase(),

        marks:
          Number(marks) || 1,

      })

      .returning();


    return res.status(201).json({

      success: true,

      message:
        "Question added successfully",

      data: result[0],

    });

  } catch (error) {

    console.error(
      "CREATE MCQ ERROR:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Failed to create MCQ question",

    });

  }

};


// ======================================
// DELETE QUESTION
// ======================================

export const deleteMCQQuestion = async (
  req,
  res
) => {

  try {

    const { id } = req.params;


    if (!id) {

      return res.status(400).json({

        success: false,

        message:
          "Question ID is required",

      });

    }


    const result = await db

      .delete(MCQQuestions)

      .where(
        eq(
          MCQQuestions.id,
          Number(id)
        )
      )

      .returning();


    if (result.length === 0) {

      return res.status(404).json({

        success: false,

        message:
          "Question not found",

      });

    }


    return res.status(200).json({

      success: true,

      message:
        "Question deleted successfully",

      data: result[0],

    });

  } catch (error) {

    console.error(
      "DELETE MCQ ERROR:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Failed to delete question",

    });

  }

};

export const getMCQExams = async (req, res) => {
  try {
    const exams = await db
      .select()
      .from(MCQExams)
      .orderBy(desc(MCQExams.id));

    return res.status(200).json({
      success: true,
      data: exams,
    });
  } catch (error) {
    console.error("GET MCQ EXAMS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch MCQ exams",
    });
  }
};