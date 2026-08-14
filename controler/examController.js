import { db } from "../db/index.js";
import { Exams } from "../db/schema.js";
import { eq } from "drizzle-orm";


// =====================================================
// GET — সব Exam দেখো
// =====================================================

export async function getExams(req, res) {
  try {
    const exams = await db
      .select()
      .from(Exams)
      .orderBy(Exams.id);

    return res.status(200).json({
      exams,
    });

  } catch (error) {
    console.error("GET EXAMS ERROR:", error);

    return res.status(500).json({
      error: error.message,
    });
  }
}


// =====================================================
// POST — নতুন Exam add
// =====================================================

export async function addExam(req, res) {
  try {
    const {
      examName,
      examYear,
      class1,
      section,
    } = req.body;


    if (
      !examName ||
      !examYear ||
      !class1 ||
      !section
    ) {
      return res.status(400).json({
        error: "All fields required",
      });
    }


    const newExam = await db
      .insert(Exams)
      .values({
        examName,
        examYear,
        class1,
        section,
      })
      .returning();


    return res.status(201).json({
      success: true,
      exam: newExam[0],
    });

  } catch (error) {
    console.error("ADD EXAM ERROR:", error);

    return res.status(500).json({
      error: error.message,
    });
  }
}


// =====================================================
// DELETE — Exam delete
// =====================================================

export async function deleteExam(req, res) {
  try {
    const { id } = req.params;

    const examId = Number(id);


    if (!examId) {
      return res.status(400).json({
        error: "Invalid Exam ID",
      });
    }


    const deleted = await db
      .delete(Exams)
      .where(eq(Exams.id, examId))
      .returning();


    if (!deleted.length) {
      return res.status(404).json({
        error: "Exam not found",
      });
    }


    return res.status(200).json({
      success: true,
      message: "Exam deleted",
    });

  } catch (error) {
    console.error("DELETE EXAM ERROR:", error);

    return res.status(500).json({
      error: error.message,
    });
  }
}