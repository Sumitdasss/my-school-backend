import { db } from "../db/index.js";

import {
  TeacherAssignments,
  Teacher,
  Subjects,
} from "../db/schema.js";

import { eq } from "drizzle-orm";


// =====================================================
// GET — সব Assignment + সব Teacher
// =====================================================

export async function getAssignments(req, res) {
  try {

    const assignments = await db
      .select({
        id: TeacherAssignments.id,
        teacherName: Teacher.fullName,
        subjectName: Subjects.subjectName,
        class1: TeacherAssignments.class1,
        section: TeacherAssignments.section,
      })

      .from(TeacherAssignments)

      .innerJoin(
        Teacher,
        eq(
          TeacherAssignments.teacherId,
          Teacher.id
        )
      )

      .innerJoin(
        Subjects,
        eq(
          TeacherAssignments.subjectId,
          Subjects.id
        )
      )

      .orderBy(TeacherAssignments.id);


    const teachers = await db
      .select({
        id: Teacher.id,
        fullName: Teacher.fullName,
      })
      .from(Teacher);


    return res.status(200).json({
      assignments,
      teachers,
    });

  } catch (error) {

    console.error(
      "GET ASSIGNMENTS ERROR:",
      error
    );

    return res.status(500).json({
      error: error.message,
    });
  }
}


// =====================================================
// POST — Teacher কে Subject assign
// =====================================================

export async function addAssignment(req, res) {
  try {

    const {
      teacherId,
      subjectId,
      class1,
      section,
    } = req.body;


    if (
      !teacherId ||
      !subjectId ||
      !class1 ||
      !section
    ) {
      return res.status(400).json({
        error: "All fields required",
      });
    }


    const newAssignment = await db
      .insert(TeacherAssignments)
      .values({
        teacherId,
        subjectId,
        class1,
        section,
      })
      .returning();


    return res.status(201).json({
      success: true,
      assignment: newAssignment[0],
    });

  } catch (error) {

    console.error(
      "ADD ASSIGNMENT ERROR:",
      error
    );

    return res.status(500).json({
      error: error.message,
    });
  }
}


// =====================================================
// DELETE — Assignment delete
// =====================================================

export async function deleteAssignment(req, res) {
  try {

    const { id } = req.params;

    const assignmentId = Number(id);


    if (!assignmentId) {
      return res.status(400).json({
        error: "Invalid Assignment ID",
      });
    }


    const deleted = await db
      .delete(TeacherAssignments)
      .where(
        eq(
          TeacherAssignments.id,
          assignmentId
        )
      )
      .returning();


    if (!deleted.length) {
      return res.status(404).json({
        error: "Assignment not found",
      });
    }


    return res.status(200).json({
      success: true,
      message: "Assignment deleted successfully",
    });

  } catch (error) {

    console.error(
      "DELETE ASSIGNMENT ERROR:",
      error
    );

    return res.status(500).json({
      error: error.message,
    });
  }
}