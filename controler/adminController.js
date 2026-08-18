import bcrypt from "bcrypt";
import { SignJWT } from "jose";
import { eq } from "drizzle-orm";

import { db } from "../db/index.js";
import { Admin } from "../db/schema.js";


// ===============================
// ADMIN LOGIN
// ===============================

export const adminLogin = async (req, res) => {
  try {

    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }

    // Find Admin
    const result = await db
      .select()
      .from(Admin)
      .where(eq(Admin.username, username))
      .limit(1);

    const admin = result[0];

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Wrong username or password",
      });
    }

    // Password check
    const isMatch = await bcrypt.compare(
      password,
      admin.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Wrong username or password",
      });
    }

    // JWT
    const token = await new SignJWT({
      id: admin.id,
      username: admin.username,
      role: admin.role,
    })
      .setProtectedHeader({
        alg: "HS256",
      })
      .setExpirationTime("2h")
      .sign(
        new TextEncoder().encode(
          process.env.JWT_SECRET
        )
      );

    return res.status(200).json({
      success: true,
      token,

      admin: {
        id: admin.id,
        username: admin.username,
        fullName: admin.fullName,
        email: admin.email,
        role: admin.role,
      },
    });

  } catch (error) {

    console.error("Admin Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};