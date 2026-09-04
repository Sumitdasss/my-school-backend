import { db } from "../db/index.js";
import {
  Parent,
  Students,
  ParentLoginHistory,
} from "../db/schema.js";

import { eq, and } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import emitter from "../lib/events.js";
import "../lib/listener.js";


// ===============================
// PARENT LOGIN
// ===============================

export const Parentlogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const Parent11 = await db
      .select()
      .from(Parent)
      .where(eq(Parent.email, email))
      .limit(1);

    // Parent not found
    if (Parent11.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Parent not found",
      });
    }

    const Parentall = Parent11[0];

    // Password check
    const match = await bcrypt.compare(
      password,
      Parentall.password
    );

    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Wrong password",
      });
    }


    // ===============================
    // FIND CHILD
    // ===============================

    const student = await db
      .select()
      .from(Students)
      .where(
        and(
          eq(
            Students.fullName,
            Parentall.childName
          ),
          eq(
            Students.rollNumber,
            Parentall.childRoll
          )
        )
      );


    // Connect child with parent
    if (student.length > 0) {
      await db
        .update(Students)
        .set({
          parentId: Parentall.id,
        })
        .where(
          eq(
            Students.id,
            student[0].id
          )
        );
    }


    // ===============================
    // GET ALL CHILDREN
    // ===============================

    const students = await db
      .select()
      .from(Students)
      .where(
        eq(
          Students.parentId,
          Parentall.id
        )
      );


    // ===============================
    // CREATE JWT
    // ===============================

    const token = jwt.sign(
      {
        parentId: Parentall.id,
        email: Parentall.email,
        role: "parent",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );


    // ===============================
    // LOGIN HISTORY
    // ===============================

    await db
      .insert(ParentLoginHistory)
      .values({
        ParentId: Parentall.id,
        loginAt: new Date(),
      });


    // Event
    emitter.emit(
      "Parent Login",
      Parentall
    );


    // ===============================
    // RESPONSE
    // ===============================

    return res.status(200).json({
      success: true,
      token,
      parent: Parentall,
      students,
    });

  } catch (error) {

    console.error(
      "Parent Login Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Parent login failed",
      error: error.message,
    });
  }
};



// ===============================
// GET PARENT PROFILE
// ===============================

export const getParentProfile = async (
  req,
  res
) => {

  try {

    const parentId = Number(
      req.userId
    );


    if (!Number.isInteger(parentId)) {

      return res.status(400).json({
        success: false,
        message: "Invalid parent ID",
      });

    }


    const parent = await db
      .select()
      .from(Parent)
      .where(
        eq(
          Parent.id,
          parentId
        )
      )
      .limit(1);


    if (parent.length === 0) {

      return res.status(404).json({
        success: false,
        message: "Parent not found",
      });

    }


    return res.status(200).json({

      success: true,

      data: parent[0],

    });


  } catch (error) {

    console.error(
      "Get Parent Profile Error:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        "Failed to get parent profile",

    });

  }

};