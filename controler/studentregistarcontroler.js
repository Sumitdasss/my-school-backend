import { db } from "../db/index.js";
import { Students } from "../db/schema.js";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export const studentRegister = async (req, res) => {
  try {
   const {
  fullName,
  fatherName,
  motherName,
  dateOfBirth,
  phone,
  email,
  password,
  rollNumber,
  section,
  class11
} = req.body;
console.log(req.body);


    // Cloudinary URL
    const photoPath = req.file ? req.file.path : "";

    // Email Check
    const emailExists = await db
      .select()
      .from(Students)
      .where(eq(Students.email, email));

    if (emailExists.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Phone Check
    const phoneExists = await db
      .select()
      .from(Students)
      .where(eq(Students.phone, phone));

    if (phoneExists.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Phone already exists",
      });
    }

    // Roll Check
    const rollExists = await db
      .select()
      .from(Students)
      .where(eq(Students.rollNumber, rollNumber));

    if (rollExists.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Roll Number already exists",
      });
    }

    // Password Hash
    const hashedPassword = await bcrypt.hash(password, 10);


    // Insert Student
   const student = {
  fullName,
  fatherName,
  motherName,
  dateOfBirth: new Date(dateOfBirth),
  phone,
  email,
  rollNumber,
  password: hashedPassword,
  photo: photoPath,
  class1: class11,
  section,
};

console.log(student);

await db.insert(Students).values(student);
    return res.status(201).json({
      success: true,
      message: "Student Registered Successfully",
    });

  } catch (error) {
  console.error(error);

  return res.status(500).json({
    success: false,
    message: error.message,
    cause: error.cause,
  });
}
};