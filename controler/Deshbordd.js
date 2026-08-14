import { db } from "../db/index.js";

import {
  Students,
  Teacher,
  Parent,
  LoginHistory,
  ParentLoginHistory,
  TeacherLoginHistory,
} from "../db/schema.js";

import {
  and,
  gte,
  lt,
  eq,
  sql,
} from "drizzle-orm";


export const getDashboardData = async (req, res) => {

  try {

    // =========================
    // ALL DATA
    // =========================

    const students =
      await db
        .select()
        .from(Students);

    const teachers =
      await db
        .select()
        .from(Teacher);

    const parents =
      await db
        .select()
        .from(Parent);


    // =========================
    // CURRENT MONTH
    // =========================

    const now = new Date();

    const currentMonthStart =
      new Date(
        now.getFullYear(),
        now.getMonth(),
        1
      );


    // =========================
    // DELETE OLD LOGIN HISTORY
    // =========================

    const fiveHoursAgo =
      new Date(
        Date.now() -
        5 * 60 * 60 * 1000
      );


    await db
      .delete(LoginHistory)
      .where(
        lt(
          LoginHistory.loginAt,
          fiveHoursAgo
        )
      );


    await db
      .delete(ParentLoginHistory)
      .where(
        lt(
          ParentLoginHistory.loginAt,
          fiveHoursAgo
        )
      );


    await db
      .delete(TeacherLoginHistory)
      .where(
        lt(
          TeacherLoginHistory.loginAt,
          fiveHoursAgo
        )
      );


    // =========================
    // PREVIOUS MONTH
    // =========================

    const previousMonthStart =
      new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        1
      );


    // =========================
    // CURRENT MONTH STUDENTS
    // =========================

    const currentStudents =
      await db
        .select()
        .from(Students)
        .where(
          gte(
            Students.createdAt,
            currentMonthStart
          )
        );


    // =========================
    // CURRENT MONTH PARENTS
    // =========================

    const currentParent =
      await db
        .select()
        .from(Parent)
        .where(
          gte(
            Parent.createdAt,
            currentMonthStart
          )
        );


    // =========================
    // LAST MONTH STUDENTS
    // =========================

    const previousStudents =
      await db
        .select()
        .from(Students)
        .where(
          and(
            gte(
              Students.createdAt,
              previousMonthStart
            ),

            lt(
              Students.createdAt,
              currentMonthStart
            )
          )
        );


    // =========================
    // LAST MONTH PARENTS
    // =========================

    const previousPrent =
      await db
        .select()
        .from(Parent)
        .where(
          and(
            gte(
              Parent.createdAt,
              previousMonthStart
            ),

            lt(
              Parent.createdAt,
              currentMonthStart
            )
          )
        );


    // =========================
    // STUDENT GROWTH
    // =========================

    const difference =
      currentStudents.length -
      previousStudents.length;


    const studentGrowth =
      previousStudents.length === 0

        ? "0.0"

        : Math.min(
            difference * 2,

            Number(
              (
                (
                  (
                    currentStudents.length -
                    previousStudents.length
                  ) /
                  previousStudents.length
                ) * 100
              ).toFixed(1)
            )
          );


    // =========================
    // PARENT GROWTH
    // =========================

    const parentDifference =
      currentParent.length -
      previousPrent.length;


    const ParentGrowth =
      previousPrent.length === 0

        ? "0.0"

        : Math.min(
            parentDifference * 2,

            Number(
              (
                (
                  (
                    currentParent.length -
                    previousPrent.length
                  ) /
                  previousPrent.length
                ) * 100
              ).toFixed(1)
            )
          );


    // =========================
    // TEACHER STATUS
    // =========================

    let teacherStatus = "";


    if (
      teachers.length >= 1 &&
      teachers.length <= 10
    ) {

      teacherStatus = "Low";

    }

    else if (
      teachers.length >= 11 &&
      teachers.length <= 20
    ) {

      teacherStatus = "Average";

    }

    else if (
      teachers.length >= 21 &&
      teachers.length <= 40
    ) {

      teacherStatus = "Good";

    }

    else if (
      teachers.length >= 41
    ) {

      teacherStatus = "Excellent";

    }


    // =========================
    // STUDENT ACTIVITIES
    // =========================

    const studentActivities =
      await db
        .select({
          id: LoginHistory.id,

          name: Students.fullName,

          info: Students.rollNumber,

          role: sql`'Student'`,

          loginAt:
            LoginHistory.loginAt,
        })

        .from(LoginHistory)

        .leftJoin(
          Students,
          eq(
            LoginHistory.studentId,
            Students.id
          )
        );


    // =========================
    // PARENT ACTIVITIES
    // =========================

    const parentActivities =
      await db
        .select({
          id:
            ParentLoginHistory.id,

          name:
            Parent.fullName,

          info:
            Parent.phone,

          role:
            sql`'Parent'`,

          loginAt:
            ParentLoginHistory.loginAt,
        })

        .from(
          ParentLoginHistory
        )

        .leftJoin(
          Parent,
          eq(
            ParentLoginHistory.ParentId,
            Parent.id
          )
        );


    // =========================
    // TEACHER ACTIVITIES
    // =========================

    const teacherActivities =
      await db
        .select({
          id:
            TeacherLoginHistory.id,

          name:
            Teacher.fullName,

          info:
            Teacher.id,

          role:
            sql`'Teacher'`,

          loginAt:
            TeacherLoginHistory.loginAt,
        })

        .from(
          TeacherLoginHistory
        )

        .leftJoin(
          Teacher,
          eq(
            TeacherLoginHistory.TeacherId,
            Teacher.id
          )
        );


    // =========================
    // COMBINE ACTIVITIES
    // =========================

    const activities = [

      ...studentActivities,

      ...parentActivities,

      ...teacherActivities,

    ]

      .sort(
        (a, b) =>
          new Date(b.loginAt) -
          new Date(a.loginAt)
      )

      .slice(0, 10);


    // =========================
    // RESPONSE
    // =========================

    return res.json({

      totalStudents:
        students.length,

      totalTeachers:
        teachers.length,

      totalParents:
        parents.length,

      studentGrowth:
        `${studentGrowth}%`,

      ParentGrowth:
        `${ParentGrowth}%`,

      teacherStatus,

      activities,

    });


  } catch (error) {

    console.error(
      "Dashboard Error:",
      error
    );


    return res
      .status(500)
      .json({

        message:
          error.message,

      });

  }

};