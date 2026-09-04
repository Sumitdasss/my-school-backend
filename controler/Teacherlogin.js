import { db } from "../db/index.js";
import { Teacher,TeacherLoginHistory } from "../db/schema.js";
import { eq} from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import emitter from "../lib/events.js";
import "../lib/listener.js";

export const  Teacherlogin=async (req,res)=>{

    try{
const {email, password}=req.body

const teachers= await db.select().from(Teacher).where(eq(Teacher.email,email));
if(teachers.length===0){return res.status(200).json( { message: "Student not found" }, { status: 404 } )}

  const teacher = teachers[0];
  const match = await bcrypt.compare(password, teacher.password);

 if (!match) {
      return res.status(200).json(  { message: "Wrong password" },
        { status: 401 })
      
      
    }





    const token = jwt.sign(
          {
            id: teacher.id,
            email: teacher.email,
              role: "teacher",
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "7d",
          }
        );
await db.insert(TeacherLoginHistory).values({
  TeacherId: teacher.id,
  loginAt: new Date(),
});
emitter.emit("Teacher Login",teacher)
   return res.status(200).json({
  success: true,
  token,
      teacher,
});

    }catch(err){
         console.log(err.cause);
         return res.status(500).json(
    {
      error: error.message,
      cause: error.cause?.message,
      detail: error.cause,
    },
    { status: 500 }
  );

    }

}

export const getTeacherProfile = async (req, res) => {
  try {

    const teacherId = req.teacherId;

    const teacher = await db
      .select()
      .from(Teacher)
      .where(eq(Teacher.id, teacherId))
      .limit(1);

    if (teacher.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: teacher[0],
    });

  } catch (error) {

    console.error(
      "Get Teacher Profile Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to get teacher profile",
    });
  }
};