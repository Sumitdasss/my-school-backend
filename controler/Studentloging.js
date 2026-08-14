import { db } from "../db/index.js";
import { Students } from "../db/schema.js";
import { eq } from "drizzle-orm";
import fs from "fs";
import path from "path";


// =====================================================
// GET STUDENT BY ID
// GET /api/student/:id
// =====================================================

export const getStudentById = async (req, res) => {
  try {
    const { id } = req.query;

    console.log("Student ID received:", id);
    console.log("Student ID type:", typeof id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Student ID is required",
      });
    }

    const studentId = Number(id);

    if (!Number.isInteger(studentId) || studentId <= 0) {
      return res.status(400).json({
        success: false,
        message: `Invalid Student ID: ${id}`,
      });
    }

    const student = await db
      .select()
      .from(Students)
      .where(eq(Students.id, studentId))
      .limit(1);

    console.log("Student Data:", student);

    if (student.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Student Not Found",
      });
    }

    return res.status(200).json({
      success: true,
      data: student[0],
    });

  } catch (error) {
    console.error("Get Student Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get student details",
      error: error.message,
    });
  }
};


// =====================================================
// UPDATE STUDENT
// PUT /api/student/:id
// =====================================================

export const updateStudent = async (req, res) => {
  try {

    const { id } = req.params;

    console.log("Update Student ID:", id);


    // ==========================================
    // CHECK STUDENT
    // ==========================================

    const student = await db
      .select()
      .from(Students)
      .where(
        eq(
          Students.id,
          Number(id)
        )
      );


    if (student.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Student Not Found",
      });
    }


    // ==========================================
    // FORM DATA
    // ==========================================

    const {
      fullName,
      phone,
      email,
      rollNumber,
      class: className,
      section,
    } = req.body;


    // ==========================================
    // PHOTO
    // ==========================================

    let photoPath =
      student[0].photo || null;


    if (req.file) {

      const uploadDir = path.join(
        process.cwd(),
        "public",
        "uploads"
      );


      // Create folder if doesn't exist

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(
          uploadDir,
          {
            recursive: true,
          }
        );
      }


      const fileName =
        `${Date.now()}-${req.file.originalname}`;


      const filePath =
        path.join(
          uploadDir,
          fileName
        );


      fs.writeFileSync(
        filePath,
        req.file.buffer
      );


      photoPath =
        `/uploads/${fileName}`;
    }


    // ==========================================
    // UPDATE DATABASE
    // ==========================================

    await db
      .update(Students)
      .set({

        fullName:
          fullName ??
          student[0].fullName,

        phone:
          phone ??
          student[0].phone,

        email:
          email ??
          student[0].email,

        rollNumber:
          rollNumber ??
          student[0].rollNumber,

        class1:
          className ??
          student[0].class1,

        section:
          section ??
          student[0].section,

        photo:
          photoPath,

      })
      .where(
        eq(
          Students.id,
          Number(id)
        )
      );


    return res.status(200).json({

      success: true,

      message:
        "Student Updated Successfully",

    });


  } catch (error) {

    console.error(
      "Update Student Error:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        error.message,

    });
  }
};


// =====================================================
// DELETE STUDENT
// DELETE /api/student/:id
// =====================================================

export const deleteStudent1122 = async (req, res) => {

  try {

    const { id } = req.params;

    console.log(
      "Delete Student ID:",
      id
    );


    // ==========================================
    // CHECK STUDENT
    // ==========================================

    const student = await db
      .select()
      .from(Students)
      .where(
        eq(
          Students.id,
          Number(id)
        )
      );


    if (student.length === 0) {

      return res.status(404).json({

        success: false,

        message:
          "Student Not Found",

      });

    }


    // ==========================================
    // DELETE
    // ==========================================

    await db
      .delete(Students)
      .where(
        eq(
          Students.id,
          Number(id)
        )
      );


    return res.status(200).json({

      success: true,

      message:
        "Student Deleted Successfully",

    });


  } catch (error) {

    console.error(
      "Delete Student Error:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        error.message,

    });

  }

};