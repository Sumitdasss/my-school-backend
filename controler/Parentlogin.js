import { db } from "../db/index.js";
import { Parent,Students,ParentLoginHistory  } from "../db/schema.js";
import { eq,and } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import emitter from "../lib/events.js";
import "../lib/listener.js";

export const  Parentlogin=async (req,res)=>{

    try{
const {email, password}=req.body

const Parent11= await db.select().from(Parent).where(eq(Parent.email,email));
if(Parent11.length===0){return res.status(200).json( { message: "Student not found" }, { status: 404 } )}

  const Parentall = Parent11[0];
  const match = await bcrypt.compare(password, Parentall.password);

 if (!match) {
      return res.status(200).json(  { message: "Wrong password" },
        { status: 401 })
      
      
    }
const student = await db
  .select()
  .from(Students)
  .where(
    and(
      eq(Students.fullName, Parentall.childName),
      eq(Students.rollNumber, Parentall.childRoll)
    )
  );

if (student.length > 0) {
  await db
    .update(Students)
    .set({
      parentId: Parentall.id,
    })
    .where(eq(Students.id, student[0].id));
}

const students = await db
  .select()
  .from(Students)
  .where(eq(Students.parentId, Parentall.id));

    const token = jwt.sign(
      {
        id: Parentall.id,
        email: Parentall.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );
await db.insert(ParentLoginHistory).values({
  ParentId: Parentall.id,
  loginAt: new Date(),
});
emitter.emit("Parent Login",Parentall)
   return res.status(200).json({
  success: true,
  token,
  Parentall,
  students,
});

    }catch(err){
         console.log(err.cause);
         return Response.json(
    {
      error: error.message,
      cause: error.cause?.message,
      detail: error.cause,
    },
    { status: 500 }
  );

    }

}