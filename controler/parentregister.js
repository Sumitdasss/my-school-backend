import { db } from "../db/index.js";
import { Parent } from "../db/schema.js";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export const ParentRegister = async (req, res) => {
  try {
   const {
  fullName,
email,
phone,

password,

  
} = req.body;
console.log(req.body);


    // Cloudinary URL
    const photoPath = req.file ? req.file.path : "";

    // Email Check
    const emailExists = await db
      .select()
      .from(Parent)
      .where(eq(Parent.email, email));

    if (emailExists.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Phone Check
    const phoneExists = await db
      .select()
      .from(Parent)
      .where(eq(Parent.phone, phone));

    if (phoneExists.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Phone already exists",
      });
    }

    // Roll Check


    // Password Hash
    const hashedPassword = await bcrypt.hash(password, 10);


    // Insert Student
   const Prent = {
  fullName,
childName:null,
childClass:null,
childRoll:null,
childEmail:null,
phone,
email,
password: hashedPassword,
photo: photoPath,
  
};

console.log(Prent);

await db.insert(Parent).values(Prent);
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