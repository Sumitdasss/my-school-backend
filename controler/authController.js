import { db } from "../db/index.js";
import { Students, LoginHistory } from "../db/schema.js";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import emitter from "../lib/events.js";
import "../lib/listener.js";

export const studentLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const student = await db
      .select()
      .from(Students)
      .where(eq(Students.email, email));

    if (student.length === 0) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    const studentData = student[0];

    const match = await bcrypt.compare(
      password,
      studentData.password
    );

    if (!match) {
      return res.status(401).json({
        message: "Wrong password",
      });
    }

   const token = jwt.sign(
  {
    studentId: studentData.id,
    email: studentData.email,
    role: "student",
  },
  process.env.JWT_SECRET,
  {
    expiresIn: "7d",
  }
);

    await db.insert(LoginHistory).values({
      studentId: studentData.id,
      loginAt: new Date(),
    });

    emitter.emit("student-login", studentData);

    return res.status(200).json({
      success: true,
      token,
      student: studentData,
    });

  } catch (error) {
     console.error("DB ERROR:", error);


    return res.status(500).json({
      message: error.message,
    });
  }
};