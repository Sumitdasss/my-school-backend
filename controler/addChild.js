import { and, eq } from "drizzle-orm";
import { Parent, Students } from "../db/schema.js";
import { db } from "../db/index.js";



export const addChild = async (req, res) => {
  try {
    // JWT middleware থেকে parentId
   const parentId = Number( req.userId );

    const {
      studentName,
      rollNumber,
      class1,
      section,
    } = req.body;

    // =====================================
    // VALIDATION
    // =====================================

    if (
      !parentId ||
      !studentName ||
      !rollNumber ||
      !class1 ||
      !section
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Student Name, Roll Number, Class and Section are required.",
      });
    }

    // =====================================
    // PARENT EXISTS?
    // =====================================

    const parent = await db
      .select()
      .from(Parent)
      .where(eq(Parent.id, parentId));

    if (parent.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Parent not found.",
      });
    }

    // =====================================
    // FIND STUDENT
    // =====================================

    const student = await db
      .select()
      .from(Students)
      .where(
        and(
          eq(Students.rollNumber, Number(rollNumber)),
          eq(Students.class1, class1),
          eq(Students.section, section)
        )
      );

    if (student.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Student not found.",
      });
    }

    // =====================================
    // ALREADY LINKED?
    // =====================================

    if (student[0].parentId) {
      return res.status(400).json({
        success: false,
        message:
          "This student is already linked to a parent.",
      });
    }

    // =====================================
    // LINK STUDENT WITH PARENT
    // =====================================

    await db
      .update(Students)
      .set({
        parentId: parentId,
      })
      .where(eq(Students.id, student[0].id));

    // =====================================
    // SUCCESS
    // =====================================

    return res.status(200).json({
      success: true,
      message: "Child added successfully.",
    });

  } catch (error) {
    console.error("Add Child Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
}



export const getMyStudents = async (req, res) => {
  try {
    // parentAuth middleware থেকে parentId আসবে
    const parentId = Number(req.userId);

    if (!parentId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // এই parent-এর সাথে যেসব student linked আছে
    const students = await db
      .select()
      .from(Students)
      .where(
        eq(Students.parentId, parentId)
      );

    return res.status(200).json({
      success: true,
      students,
    });

  } catch (error) {
    console.error("Show Child Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};


export const removeChild = async (req, res) => {
  try {
    // JWT থেকে parentId
    const parentId = Number(req.userId);

    // Frontend থেকে studentId
    const { studentId } = req.body;

    console.log("Remove Child Request:", {
      parentId,
      studentId,
    });

    // ==============================
    // CHECK AUTH
    // ==============================

    if (!parentId) {
      return res.status(401).json({
        success: false,
        message: "Parent authentication required.",
      });
    }

    // ==============================
    // CHECK STUDENT ID
    // ==============================

    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: "Student ID is required.",
      });
    }

    const studentIdNumber = Number(studentId);

    if (Number.isNaN(studentIdNumber)) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID.",
      });
    }

    // ==============================
    // CHECK STUDENT BELONGS TO PARENT
    // ==============================

    const student = await db
      .select()
      .from(Students)
      .where(
        and(
          eq(Students.id, studentIdNumber),
          eq(Students.parentId, parentId)
        )
      );

    if (student.length === 0) {
      return res.status(404).json({
        success: false,
        message:
          "Student not found or this student does not belong to you.",
      });
    }

    // ==============================
    // REMOVE CHILD
    // ==============================

    await db
      .update(Students)
      .set({
        parentId: null,
      })
      .where(
        and(
          eq(Students.id, studentIdNumber),
          eq(Students.parentId, parentId)
        )
      );

    // ==============================
    // SUCCESS
    // ==============================

    return res.status(200).json({
      success: true,
      message: "Child removed successfully.",
    });

  } catch (error) {
    console.error("Remove Child Error:", error);

    return res.status(500).json({
      success: false,
      message:
        error.message || "Internal Server Error",
    });
  }
};