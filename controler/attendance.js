
import { db } from "../db/index.js";
import { Attendance, Students } from "../db/schema.js";
import { eq } from "drizzle-orm";

// =====================================
// GET PARENT CHILDREN ATTENDANCE
// =====================================

export const getParentAttendance = async (req, res) => {
  try {
    // =====================================
    // GET PARENT ID FROM JWT MIDDLEWARE
    // =====================================

    const parentId = Number(req.userId);

    console.log("Parent ID:", parentId);

    if (!parentId) {
      return res.status(401).json({
        success: false,
        message: "Parent authentication required.",
      });
    }

    // =====================================
    // GET ALL STUDENTS OF THIS PARENT
    // =====================================

    const students = await db
      .select()
      .from(Students)
      .where(
        eq(
          Students.parentId,
          parentId
        )
      );

    // =====================================
    // NO STUDENTS
    // =====================================

    if (students.length === 0) {
      return res.status(200).json({
        success: true,
        children: [],
        message: "No students found.",
      });
    }

    const result = [];

    // =====================================
    // GET ATTENDANCE FOR EACH STUDENT
    // =====================================

    for (const student of students) {
      const attendance = await db
        .select()
        .from(Attendance)
        .where(
          eq(
            Attendance.studentId,
            student.id
          )
        );

      // =====================================
      // TOTAL PRESENT
      // =====================================

      const totalPresent = attendance.filter(
        (item) =>
          item.status === "Yes" ||
          item.status === "Present"
      ).length;

      // =====================================
      // TOTAL ABSENT
      // =====================================

      const totalAbsent = attendance.filter(
        (item) =>
          item.status === "No" ||
          item.status === "Absent"
      ).length;

      // =====================================
      // ABSENT DATES
      // =====================================

      const absentDates = attendance
        .filter(
          (item) =>
            item.status === "No" ||
            item.status === "Absent"
        )
        .map((item) => ({
          id: item.id,
          date: item.attendanceDate,
          status: item.status,
        }));

      // =====================================
      // CHILD DATA
      // =====================================

      result.push({
        student: {
          id: student.id,
          fullName: student.fullName,
          photo: student.photo,
          rollNumber: student.rollNumber,
          class1: student.class1,
          section: student.section,
        },

        summary: {
          totalDays: attendance.length,
          present: totalPresent,
          absent: totalAbsent,
        },

        attendance,

        absentDates,
      });
    }

    // =====================================
    // SUCCESS RESPONSE
    // =====================================

    return res.status(200).json({
      success: true,
      children: result,
    });

  } catch (error) {
    console.error(
      "Parent Attendance Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Internal Server Error",
    });
  }
};

