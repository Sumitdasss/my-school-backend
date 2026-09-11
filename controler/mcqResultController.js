import { eq, desc } from "drizzle-orm";

import { db } from "../db/index.js";

import {
  MCQResults,
  Students,
  MCQExams,
  OMRSubmissions,
} from "../db/schema.js";

// ==========================================
// GET ALL MCQ RESULTS WITH STUDENT DETAILS
// ==========================================

export const getAllMCQResults = async (req, res) => {
  try {
    const results = await db
      .select({
        result: MCQResults,

        student: {
          id: Students.id,
          name: Students.fullName,
          email: Students.email,
          rollNumber: Students.rollNumber,
         photo: Students.photo,
        },

        exam: {
          id: MCQExams.id,
          examCode: MCQExams.examCode,
          examName: MCQExams.examName,
        },
      })
      .from(MCQResults)

      .leftJoin(
        Students,
        eq(MCQResults.studentId, Students.id)
      )

      .leftJoin(
        MCQExams,
        eq(MCQResults.examId, MCQExams.id)
      )

      .orderBy(desc(MCQResults.id));

    return res.status(200).json({
      success: true,
      count: results.length,
      data: results,
    });

  } catch (error) {
    console.error(
      "GET ALL MCQ RESULTS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch MCQ results",
    });
  }
};


// ==========================================
// GET RESULT BY RESULT ID
// ==========================================

export const getMCQResultById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({
        success: false,
        message: "Valid result ID is required",
      });
    }

    const results = await db
      .select({
        result: MCQResults,

        student: {
          id: Students.id,
          name: Students.fullName,
          email: Students.email,
          rollNumber: Students.rollNumber,
        },

        exam: {
          id: MCQExams.id,
          examCode: MCQExams.examCode,
          examName: MCQExams.examName,
        },
      })
      .from(MCQResults)

      .leftJoin(
        Students,
        eq(MCQResults.studentId, Students.id)
      )

      .leftJoin(
        MCQExams,
        eq(MCQResults.examId, MCQExams.id)
      )

      .where(
        eq(
          MCQResults.id,
          Number(id)
        )
      );

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "MCQ result not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: results[0],
    });

  } catch (error) {
    console.error(
      "GET MCQ RESULT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch MCQ result",
    });
  }
};


// ==========================================
// GET RESULTS BY STUDENT ID
// ==========================================

export const getMCQResultsByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    if (!studentId || isNaN(Number(studentId))) {
      return res.status(400).json({
        success: false,
        message: "Valid student ID is required",
      });
    }

    const results = await db
      .select({
        result: MCQResults,

        student: {
          id: Students.id,
          name: Students.fullName,
          email: Students.email,
          rollNumber: Students.rollNumber,
        },

        exam: {
          id: MCQExams.id,
          examCode: MCQExams.examCode,
          examName: MCQExams.examName,
        },
      })
      .from(MCQResults)

      .leftJoin(
        Students,
        eq(MCQResults.studentId, Students.id)
      )

      .leftJoin(
        MCQExams,
        eq(MCQResults.examId, MCQExams.id)
      )

      .where(
        eq(
          MCQResults.studentId,
          Number(studentId)
        )
      )

      .orderBy(desc(MCQResults.id));

    return res.status(200).json({
      success: true,
      count: results.length,
      data: results,
    });

  } catch (error) {
    console.error(
      "GET STUDENT MCQ RESULTS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch student results",
    });
  }
};


// ==========================================
// DELETE MCQ RESULT
// ==========================================


// ==========================================
// DELETE MCQ RESULT
// ==========================================

export const deleteMCQResult = async (req, res) => {
  try {
    const { id } = req.params;

    // ==========================================
    // VALIDATE RESULT ID
    // ==========================================

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({
        success: false,
        message: "Valid result ID is required",
      });
    }

    const resultId = Number(id);

    // ==========================================
    // FIND RESULT
    // ==========================================

    const resultData = await db
      .select({
        id: MCQResults.id,
        submissionId: MCQResults.submissionId,
      })
      .from(MCQResults)
      .where(eq(MCQResults.id, resultId))
      .limit(1);

    // ==========================================
    // RESULT NOT FOUND
    // ==========================================

    if (resultData.length === 0) {
      return res.status(404).json({
        success: false,
        message: "MCQ result not found",
      });
    }

    const submissionId = resultData[0].submissionId;

    console.log("=================================");
    console.log("Deleting MCQ Result:", resultId);
    console.log("Related Submission:", submissionId);
    console.log("=================================");

    // ==========================================
    // DELETE EVERYTHING IN TRANSACTION
    // ==========================================

    await db.transaction(async (tx) => {

      // ------------------------------------------
      // DELETE OMR SUBMISSION
      // ------------------------------------------
      //
      // OMRSubmissions delete হলে
      // MCQStudentAnswers automatically delete হবে
      // কারণ schema-তে onDelete: "cascade" আছে।
      //

      await tx
        .delete(OMRSubmissions)
        .where(
          eq(
            OMRSubmissions.id,
            submissionId
          )
        );

      // ------------------------------------------
      // DELETE MCQ RESULT
      // ------------------------------------------

      await tx
        .delete(MCQResults)
        .where(
          eq(
            MCQResults.id,
            resultId
          )
        );
    });

    // ==========================================
    // SUCCESS
    // ==========================================

    console.log(
      "MCQ Result deleted successfully:",
      resultId
    );

    return res.status(200).json({
      success: true,
      message:
        "MCQ result deleted successfully. Student can take the exam again.",
    });

  } catch (error) {

    console.error(
      "DELETE MCQ RESULT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to delete MCQ result",
      error: error.message,
    });
  }
};

