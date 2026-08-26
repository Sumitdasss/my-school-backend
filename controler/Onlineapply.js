import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { admissions } from "../db/schema.js";
import { sendAdmissionStatusEmail } from "../services/emailService.js";




export const Creatapplystudent= async (req,res)=>{
try{
const {
fullName,
fatherName,
motherName,
dateOfBirth,
class:studentclass,
phone,
email,
address,
}=req.body
const Studentimg =req.file?req.file.path:null

const exsistphone=await db.select().from(admissions).where(eq(admissions.phone,phone))
if(exsistphone.length>0){
   return res.status(400).json({
  success: false,
  message: "This number already exists",
});
}

const exsistemail=await db.select().from(admissions).where(eq(admissions.email,email))
if(exsistemail.length >0){
  return res.status(400).json({
  success: false,
  message: "This email already exists",
});
}





const application = await db.insert(admissions).values({

 fullName,
        fatherName,
        motherName,
        dateOfBirth,
        class: studentclass,
        phone,
        email,
        address,
        studentImage:Studentimg,


}).returning()

 res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      data: application[0],
    });




}catch(error){
   console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to submit application",
    });
}
}

export const getapplystudent = async (req, res) => {
  try {
    const getallapplystudent = await db
      .select({
        id:admissions.id,
        fullName: admissions.fullName,
        fatherName: admissions.fatherName,
        motherName: admissions.motherName,
        dateOfBirth: admissions.dateOfBirth,
        class: admissions.class,
        phone: admissions.phone,
        email: admissions.email,
        address: admissions.address,
        studentImage: admissions.studentImage,
        status: admissions.status,
      })
      .from(admissions);

    return res.status(200).json({
      success: true,
      data: getallapplystudent,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to get admission applications",
      error: error.message,
    });
  }
};


export const updateAdmissionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatus = [
      "pending",
      "approved",
      "rejected",
    ];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const updated = await db
      .update(admissions)
      .set({
        status,
        updatedAt: new Date(),
      })
      .where(eq(admissions.id, Number(id)))
      .returning();

    if (updated.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    const student = updated[0];

    // =========================================
    // SEND EMAIL ONLY FOR APPROVED / REJECTED
    // =========================================

    let emailResult = null;

    if (
      status === "approved" ||
      status === "rejected"
    ) {
      emailResult = await sendAdmissionStatusEmail({
        email: student.email,
        fullName: student.fullName,
        status,
      });
    }

    return res.status(200).json({
      success: true,

      message:
        status === "approved"
          ? "Application approved successfully"
          : status === "rejected"
          ? "Application rejected successfully"
          : "Application status updated successfully",

      data: student,

      email: emailResult,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to update status",
      error: error.message,
    });
  }
};