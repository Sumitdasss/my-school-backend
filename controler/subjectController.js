import { db } from "../db/index.js";
import { Subjects } from "../db/schema.js";
import { eq } from "drizzle-orm";

// GET — সব Subject দেখো
export async function getSubjects(req, res) {
  try {
    const subjects = await db
      .select()
      .from(Subjects)
      .orderBy(Subjects.id);

    return res.status(200).json({
      subjects,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: err.message,
    });
  }
}


// POST — নতুন Subject add করো
export async function addSubject(req, res) {
  try {
    const { subjectName, class1 } = req.body;

    if (!subjectName || !class1) {
      return res.status(400).json({
        error: "Subject name and class required",
      });
    }

    const newSubject = await db
      .insert(Subjects)
      .values({
        subjectName,
        class1,
      })
      .returning();

    return res.status(201).json({
      success: true,
      subject: newSubject[0],
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: err.message,
    });
  }
}


// DELETE — Subject delete
export async function deleteSubject(req, res) {
  try {
    const { id } = req.params;

    console.log("ID:", id);

    const deletedSubject = await db
      .delete(Subjects)
      .where(eq(Subjects.id, Number(id)))
      .returning();

    if (deletedSubject.length === 0) {
      return res.status(404).json({
        error: "Subject not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Subject deleted",
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: err.message,
    });
  }
}