import bcrypt from "bcrypt";
import { SignJWT } from "jose";
import { eq } from "drizzle-orm";

import { db } from "../db/index.js";
import { Admin } from "../db/schema.js";

export const adminLogin = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      const error = new Error(
        "Username and password are required"
      );

      error.statusCode = 400;

      return next(error);
    }

    // Admin খোঁজা
    const result = await db
      .select()
      .from(Admin)
      .where(eq(Admin.username, username))
      .limit(1);

    const admin = result[0];

    if (!admin) {
      const error = new Error(
        "Wrong username or password"
      );

      error.statusCode = 401;

      return next(error);
    }

    // Password verify
    const isMatch = await bcrypt.compare(
      password,
      admin.password
    );

    if (!isMatch) {
      const error = new Error(
        "Wrong username or password"
      );

      error.statusCode = 401;

      return next(error);
    }

    // JWT Secret check
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is missing");
    }

    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET
    );

    // JWT তৈরি
    const token = await new SignJWT({
      id: admin.id,
      username: admin.username,
      role: admin.role,
    })
      .setProtectedHeader({
        alg: "HS256",
      })
      .setIssuedAt()
      .setExpirationTime("2h")
      .sign(secret);

    console.log("✅ Admin Login Successful");
    console.log("👤 Role:", admin.role);
    console.log(
      "🔑 JWT_SECRET exists:",
      !!process.env.JWT_SECRET
    );

    return res.status(200).json({
      success: true,
      message: "Login Successful",
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
    next(error);
  }
};