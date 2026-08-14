import { db } from "../db/index.js";
import {
  Results,
  Subjects,
  Teacher,
  Students,
  TeacherAssignments,
} from "../db/schema.js";

import { eq, and } from "drizzle-orm";


// =====================================================
// RESULT ADD / UPDATE
// PUT /api/admin1/results
// =====================================================

export async function addResult(req, res) {
  try {
    const { studentRoll, examId, results } = req.body;

    if (!studentRoll || !examId || !results?.length) {
      return res.status(400).json({
        error: "studentRoll, examId and results required",
      });
    }

    // Student খুঁজে বের করা
    const student = await db
      .select()
      .from(Students)
      .where(eq(Students.rollNumber, String(studentRoll)))
      .limit(1);

    if (!student.length) {
      return res.status(404).json({
        error: `Roll ${studentRoll} এর student পাওয়া যায়নি`,
      });
    }

    const realStudentId = student[0].id;

    // প্রতিটি subject result
    for (const r of results) {

      // আগে একই result থাকলে delete
      await db
        .delete(Results)
        .where(
          and(
            eq(Results.studentId, realStudentId),
            eq(Results.examId, Number(examId)),
            eq(Results.subjectId, Number(r.subjectId))
          )
        );

      // Subject-এর teacher খোঁজা
      const assignment = await db
        .select()
        .from(TeacherAssignments)
        .where(
          eq(
            TeacherAssignments.subjectId,
            Number(r.subjectId)
          )
        )
        .limit(1);

      const teacherId =
        assignment.length > 0
          ? assignment[0].teacherId
          : null;

      // Result insert
      await db.insert(Results).values({
        studentId: realStudentId,
        examId: Number(examId),
        subjectId: Number(r.subjectId),
        teacherId: teacherId,
        marksObtained: Number(r.marksObtained),
        totalMarks: 100,
      });
    }

    return res.status(200).json({
      success: true,
      message: `${student[0].fullName} এর result save হয়েছে!`,
    });

  } catch (error) {
    console.error("RESULT ADD ERROR:", error);

    return res.status(500).json({
      error: error.message,
    });
  }
}


// =====================================================
// RESULT VIEW
// POST /api/admin1/results/view
// =====================================================

export async function getResults(req, res) {
  try {
    const { studentId, examId } = req.body;

    if (!studentId || !examId) {
      return res.status(400).json({
        error: "studentId and examId required",
      });
    }

    // Roll number দিয়ে student খোঁজা
    const student = await db
      .select()
      .from(Students)
      .where(
        eq(
          Students.rollNumber,
          String(studentId)
        )
      )
      .limit(1);

    if (!student.length) {
      return res.status(200).json({
        results: [],
        summary: {
          totalObtained: 0,
          totalMarks: 0,
          percentage: 0,
        },
      });
    }

    const realStudentId = student[0].id;

    // Results fetch
    const results = await db
      .select({
        id: Results.id,
        subjectName: Subjects.subjectName,
        marksObtained: Results.marksObtained,
        totalMarks: Results.totalMarks,
        teacherName: Teacher.fullName,
      })
      .from(Results)

      .innerJoin(
        Subjects,
        eq(
          Results.subjectId,
          Subjects.id
        )
      )

      .leftJoin(
        Teacher,
        eq(
          Results.teacherId,
          Teacher.id
        )
      )

      .where(
        and(
          eq(
            Results.studentId,
            realStudentId
          ),
          eq(
            Results.examId,
            Number(examId)
          )
        )
      )

      .orderBy(Subjects.id);

    // Summary
    const totalObtained = results.reduce(
      (sum, r) =>
        sum + Number(r.marksObtained),
      0
    );

    const totalMarks = results.reduce(
      (sum, r) =>
        sum + Number(r.totalMarks),
      0
    );

    const percentage =
      totalMarks > 0
        ? (
            (totalObtained / totalMarks) *
            100
          ).toFixed(2)
        : 0;

    return res.status(200).json({
      student: {
        id: realStudentId,
        name: student[0].fullName,
        roll: student[0].rollNumber,
      },

      results,

      summary: {
        totalObtained,
        totalMarks,
        percentage,
      },
    });

  } catch (error) {
    console.error(
      "RESULT FETCH ERROR:",
      error
    );

    return res.status(500).json({
      error: error.message,
    });
  }
}


// =====================================================
// RESULT DELETE
// DELETE /api/admin1/results/:id
// =====================================================

export async function deleteResult(req, res) {
  try {
    const { id } = req.params;

    const resultId = Number(id);

    if (!resultId) {
      return res.status(400).json({
        error: "Invalid Result ID",
      });
    }

    const deleted = await db
      .delete(Results)
      .where(eq(Results.id, resultId))
      .returning();

    if (!deleted.length) {
      return res.status(404).json({
        error: "Result not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Result deleted successfully",
    });

  } catch (error) {
    console.error("RESULT DELETE ERROR:", error);

    return res.status(500).json({
      error: "Something went wrong",
    });
  }
}