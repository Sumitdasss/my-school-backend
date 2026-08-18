import { db } from "../db/index.js";
import {
  Students,
  Parent,
  Teacher,
  OTP,
} from "../db/schema.js";

import { eq, and } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { transporter } from "../lib/mail.js";


export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Check user
    const student = await db
      .select()
      .from(Students)
      .where(eq(Students.email, email));

    const parent = await db
      .select()
      .from(Parent)
      .where(eq(Parent.email, email));

    const teacher = await db
      .select()
      .from(Teacher)
      .where(eq(Teacher.email, email));

    if (
      student.length === 0 &&
      parent.length === 0 &&
      teacher.length === 0
    ) {
      return res.status(404).json({
        success: false,
        message: "Email not found",
      });
    }

    // Generate OTP
    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // 5 minutes
    const expiresAt = new Date(
      Date.now() + 5 * 60 * 1000
    );

    // Delete previous OTP
    await db
      .delete(OTP)
      .where(eq(OTP.email, email));

    // Save OTP
    await db.insert(OTP).values({
      email,
      otp,
      expiresAt,
    });

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset OTP",
      html: `
        <div style="font-family:Arial;padding:20px">

          <h2>School Management System</h2>

          <p>Your password reset OTP is:</p>

          <h1 style="color:#D4AF37">
            ${otp}
          </h1>

          <p>
            This OTP will expire in 5 minutes.
          </p>

          <p>
            If you did not request this, please ignore this email.
          </p>

        </div>
      `,
    });

    return res.status(200).json({
      success: true,
      message: "OTP Sent Successfully",
    });

  } catch (error) {

    console.error("Send OTP Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};



export const verifyOTP = async (req, res) => {
  try {

    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const result = await db
      .select()
      .from(OTP)
      .where(
        and(
          eq(OTP.email, email),
          eq(OTP.otp, otp)
        )
      );

    if (result.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    const otpData = result[0];

    // Expired
    if (
      new Date() >
      new Date(otpData.expiresAt)
    ) {

      await db
        .delete(OTP)
        .where(eq(OTP.email, email));

      return res.status(400).json({
        success: false,
        message: "OTP Expired",
      });
    }

    return res.status(200).json({
      success: true,
      message: "OTP Verified Successfully",
    });

  } catch (error) {

    console.error("Verify OTP Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const resetPassword = async (req, res) => {
  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // OTP must exist
    const otpData = await db
      .select()
      .from(OTP)
      .where(eq(OTP.email, email));

    if (otpData.length === 0) {
      return res.status(400).json({
        success: false,
        message: "OTP verification required",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    // Student
    const student = await db
      .select()
      .from(Students)
      .where(eq(Students.email, email));

    // Parent
    const parent = await db
      .select()
      .from(Parent)
      .where(eq(Parent.email, email));

    // Teacher
    const teacher = await db
      .select()
      .from(Teacher)
      .where(eq(Teacher.email, email));


    if (student.length > 0) {

      await db
        .update(Students)
        .set({
          password: hashedPassword,
          updatedAt: new Date(),
        })
        .where(eq(Students.email, email));

    } else if (parent.length > 0) {

      await db
        .update(Parent)
        .set({
          password: hashedPassword,
          updatedAt: new Date(),
        })
        .where(eq(Parent.email, email));

    } else if (teacher.length > 0) {

      await db
        .update(Teacher)
        .set({
          password: hashedPassword,
          updatedAt: new Date(),
        })
        .where(eq(Teacher.email, email));

    } else {

      return res.status(404).json({
        success: false,
        message: "User not found",
      });

    }

    // OTP delete
    await db
      .delete(OTP)
      .where(eq(OTP.email, email));

    return res.status(200).json({
      success: true,
      message: "Password Changed Successfully",
    });

  } catch (error) {

    console.error("Reset Password Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};