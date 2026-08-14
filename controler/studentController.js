import { db } from "../db/index.js";
import { Students } from "../db/schema.js";
import { eq, and } from "drizzle-orm";


// =====================================================
// GET — Student Search / Filter
// =====================================================

export async function getStudents(req, res) {
  try {
    const {
      roll,
      class: class1,
      section,
    } = req.query;

    let students;


    // No Filter → All Students
    if (!roll && !class1 && !section) {

      students = await db
        .select()
        .from(Students);

    }


    // Roll + Class + Section
    else if (roll && class1 && section) {

      students = await db
        .select()
        .from(Students)
        .where(
          and(
            eq(Students.rollNumber, roll),
            eq(Students.class1, class1),
            eq(Students.section, section)
          )
        );

    }


    // Roll Only
    else if (roll) {

      students = await db
        .select()
        .from(Students)
        .where(
          eq(Students.rollNumber, roll)
        );

    }


    // Class Only
    else if (class1) {

      students = await db
        .select()
        .from(Students)
        .where(
          eq(Students.class1, class1)
        );

    }


    // Section Only
    else if (section) {

      students = await db
        .select()
        .from(Students)
        .where(
          eq(Students.section, section)
        );

    }


    // Class + Section
    else if (class1 && section) {

      students = await db
        .select()
        .from(Students)
        .where(
          and(
            eq(Students.class1, class1),
            eq(Students.section, section)
          )
        );

    }


    return res.status(200).json(students);

  } catch (error) {

    console.error(
      "GET STUDENTS ERROR:",
      error
    );

    return res.status(500).json({
      error: "Failed to fetch students",
    });
  }
}


// =====================================================
// GET — Class + Section Filter Options
// =====================================================

export async function getStudentFilters(req, res) {
  try {

    const classes = await db
      .select({
        class1: Students.class1,
      })
      .from(Students)
      .groupBy(Students.class1);


    const sections = await db
      .select({
        section: Students.section,
      })
      .from(Students)
      .groupBy(Students.section);


    return res.status(200).json({
      classes,
      sections,
    });

  } catch (error) {

    console.error(
      "GET FILTERS ERROR:",
      error
    );

    return res.status(500).json({
      error: "Failed to load filters",
    });
  }
}



export async function deleteStudent(req, res) {
  try {
    const { id } = req.params;

    const studentId = Number(id);

    console.log("DELETE ID:", studentId);

    if (!studentId) {
      return res.status(400).json({
        error: "Invalid Student ID",
      });
    }

    const deleted = await db
      .delete(Students)
      .where(eq(Students.id, studentId))
      .returning();

    if (!deleted.length) {
      return res.status(404).json({
        error: "Student not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Student deleted successfully",
    });

  } catch (error) {
    console.error("DELETE STUDENT ERROR:", error);

    return res.status(500).json({
      error: error.message,
    });
  }
}