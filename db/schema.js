import {
  pgTable,
  serial,
  varchar,
  text,
    integer,
  timestamp,
  boolean,
  unique ,
  date
} from "drizzle-orm/pg-core";

export const Teacher = pgTable("Teacher", {
  id: serial("id").primaryKey(),

  fullName: varchar("full_name", { length: 255 }).notNull(),

  dateOfBirth: timestamp("date_of_birth").notNull(),

  phone: varchar("phone", { length: 20 }).unique().notNull(),

  email: varchar("email", { length: 255 }).unique().notNull(),

  password: text("password").notNull(),

  photo: text("photo"),
});

export const Parent = pgTable("Parent", {
  id: serial("id").primaryKey(),

  fullName: varchar("full_name", { length: 255 }).notNull(),

  email: varchar("email", { length: 255 })
    .notNull()
    .unique(),

  phone: varchar("phone", { length: 20 })
    .notNull()
    .unique(),
childEmail: varchar("child_email", { length: 255 }).notNull(),
  childName: varchar("child_name", { length: 255 }).notNull(),

  childClass: varchar("child_class", { length: 50 }).notNull(),

  childRoll: varchar("child_roll", { length: 50 }).notNull(),

  password: varchar("password", { length: 255 }).notNull(),

  photo: varchar("photo", { length: 500 }),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),
});


// Student Table
export const Students = pgTable("Students", {

  id: serial("id").primaryKey(),

  fullName: varchar("full_name", { length: 255 }).notNull(),

  fatherName: varchar("father_name", { length: 255 }).notNull(),

  motherName: varchar("mother_name", { length: 255 }).notNull(),

  dateOfBirth: timestamp("date_of_birth").notNull(),

  phone: varchar("phone", { length: 20 })
    .notNull()
    .unique(),

    rollNumber: varchar("roll_number", { length: 50 })
  .notNull()
  .unique(),

  email: varchar("email", { length: 255 })
    .notNull()
    .unique(),
parentId: integer("parent_id")
  .references(() => Parent.id),
  password: varchar("password", { length: 255 })
    .notNull(),

  photo: varchar("photo", { length: 500 }),


   class1: varchar("class", { length: 20 }).notNull(),      
  section: varchar("section", { length: 10 }).notNull(),


  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull(),

});
export const Admin = pgTable("admins", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).default("admin"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});
export const LoginHistory = pgTable("LoginHistory", {
  id: serial("id").primaryKey(),
  // ✅ onDelete: "cascade" যোগ করো
  studentId: integer("student_id")
    .notNull()
    .references(() => Students.id, { onDelete: "cascade" }),
  loginAt: timestamp("login_at").defaultNow().notNull(),
});
export const ParentLoginHistory = pgTable("ParentLoginHistory", {
  id: serial("id").primaryKey(),

  ParentId: integer("Parent_id")
    .notNull()
    .references(() => Parent.id),

  loginAt: timestamp("login_at")
    .defaultNow()
    .notNull(),
});
export const TeacherLoginHistory = pgTable("TeacherLoginHistory", {
  id: serial("id").primaryKey(),

  TeacherId: integer("Teacher_id")
    .notNull()
    .references(() => Teacher.id),

  loginAt: timestamp("login_at")
    .defaultNow()
    .notNull(),
});

export const Subjects = pgTable("Subjects", {
  id: serial("id").primaryKey(),
  subjectName: varchar("subjectname", { length: 100 }).notNull(),
  class1: varchar("class", { length: 20 }).notNull(),
});


export const TeacherAssignments = pgTable("TeacherAssignments", {
  id: serial("id").primaryKey(),
  teacherId: integer("teacher_id")
    .notNull()
    .references(() => Teacher.id, { onDelete: "cascade" }),
  subjectId: integer("subject_id")
    .notNull()
    .references(() => Subjects.id, { onDelete: "cascade" }),
  class1: varchar("class", { length: 20 }).notNull(),
  section: varchar("section", { length: 10 }).notNull(),
});


export const Exams = pgTable("Exams", {
  id: serial("id").primaryKey(),
  examName: varchar("exam_name", { length: 50 }).notNull(),
  examYear: integer("exam_year").notNull(),
  class1: varchar("class", { length: 20 }).notNull(),
  section: varchar("section", { length: 10 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});


export const Results = pgTable(
"Results",
{
 id: serial("id").primaryKey(),

 studentId: integer("student_id").notNull(),

 examId: integer("exam_id").notNull(),

 subjectId: integer("subject_id").notNull(),

 teacherId: integer("teacher_id"),

 marksObtained: integer("marks_obtained").notNull(),

 totalMarks: integer("total_marks").notNull(),

 createdAt: timestamp("created_at")
 .defaultNow(),

},
(table)=>({
 uniqueResult: unique()
 .on(
   table.studentId,
   table.examId,
   table.subjectId
 )
})
);

export const Attendance = pgTable(
  "Attendance",
  {
    id: serial("id").primaryKey(),

    studentId: integer("student_id")
      .notNull()
      .references(() => Students.id, { onDelete: "cascade" }),

    attendanceDate: date("attendance_date").notNull(),

    status: varchar("status", { length: 10 }).notNull(), // "Yes" বা "No"

    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    uniqueAttendance: unique("unique_student_attendance").on(
      table.studentId,
      table.attendanceDate
    ),
  })
);

export const Notices = pgTable("notices", {
  id: serial("id").primaryKey(),

  title: varchar("title", { length: 255 }).notNull(),

  slug: varchar("slug", { length: 255 }).unique().notNull(),

  category: varchar("category", { length: 100 }).notNull(),

  date: varchar("date", { length: 100 }).notNull(),

  urgent: boolean("urgent").default(false),

  shortDescription: text("short_description"),

  description: text("description"),

  attachment: varchar("attachment", { length: 500 }),

  createdAt: timestamp("created_at").defaultNow(),
});




// =============================
// Routine Header
// =============================
export const ClassRoutine = pgTable("ClassRoutine", {
  id: serial("id").primaryKey(),

  className: varchar("class_name", { length: 20 }).notNull(),

  section: varchar("section", { length: 10 }).notNull(),

  shift: varchar("shift", { length: 20 }).notNull(),

  day: varchar("day", { length: 20 }).notNull(),

  createdAt: timestamp("created_at").defaultNow(),
});

// =============================
// Routine Period
// =============================
export const RoutinePeriod = pgTable("RoutinePeriod", {
  id: serial("id").primaryKey(),

  routineId: integer("routine_id")
    .references(() => ClassRoutine.id, {
      onDelete: "cascade",
    })
    .notNull(),

  period: integer("period").notNull(),

  startTime: varchar("start_time", { length: 20 }).notNull(),

  endTime: varchar("end_time", { length: 20 }).notNull(),

  subject: varchar("subject", { length: 100 }).notNull(),

  teacher: varchar("teacher", { length: 100 }).notNull(),

  room: varchar("room", { length: 50 }),

  createdAt: timestamp("created_at").defaultNow(),
});

export const OTP = pgTable("OTP", {
  id: serial("id").primaryKey(),

  email: varchar("email", { length: 255 }).notNull(),

  otp: varchar("otp", { length: 6 }).notNull(),

  expiresAt: timestamp("expires_at").notNull(),

  createdAt: timestamp("created_at").defaultNow(),
});

export const Payments = pgTable("Payments", {
  id: serial("id").primaryKey(),

  studentId: integer("student_id")
    .notNull()
    .references(() => Students.id, { onDelete: "cascade" }),

  parentId: integer("parent_id").references(() => Parent.id),

  amount: integer("amount").notNull(),

  feeType: varchar("fee_type", { length: 100 }).notNull(),

  paymentMethod: varchar("payment_method", { length: 50 }).default("SSLCommerz"),

  transactionId: varchar("transaction_id", { length: 255 }).unique(),

  status: varchar("status", { length: 20 }).default("Pending"),

  paymentDate: timestamp("payment_date").defaultNow(),

  createdAt: timestamp("created_at").defaultNow(),
});

export const PaymentItems = pgTable("PaymentItems", {
  id: serial("id").primaryKey(),

  paymentId: integer("payment_id")
    .notNull()
    .references(() => Payments.id, { onDelete: "cascade" }),

  title: varchar("title", { length: 100 }).notNull(),

  amount: integer("amount").notNull(),
});

export const Fees = pgTable("Fees", {

  id: serial("id").primaryKey(),

  class1: varchar("class", { length: 20 }).notNull(),

  feeType: varchar("fee_type", { length: 100 }).notNull(),

  amount: integer("amount").notNull(),

  description: text("description"),

  isActive: boolean("is_active").default(true),

  createdAt: timestamp("created_at").defaultNow(),

});
export const AdmitCards = pgTable("AdmitCards", {
  id: serial("id").primaryKey(),

  studentId: integer("student_id")
    .references(() => Students.id)
    .notNull(),

  examName: varchar("exam_name", { length: 100 }).notNull(),

  examYear: integer("exam_year").notNull(),

  center: varchar("center", { length: 255 }).notNull(),

  examDate: date("exam_date").notNull(),

  examTime: varchar("exam_time", { length: 50 }).notNull(),

  room: varchar("room", { length: 50 }).notNull(),

  seatNo: varchar("seat_no", { length: 50 }).notNull(),

  status: boolean("status").default(true),

  createdAt: timestamp("created_at").defaultNow(),
});




// ======================================================
// MCQ EXAMS
// ======================================================

export const MCQExams = pgTable("mcq_exams", {
  id: serial("id").primaryKey(),

  examName: varchar("exam_name", {
    length: 255,
  }).notNull(),

  subject: varchar("subject", {
    length: 100,
  }).notNull(),

  className: varchar("class_name", {
    length: 50,
  }).notNull(),

  section: varchar("section", {
    length: 20,
  }),

  totalMarks: integer("total_marks").notNull(),

  duration: integer("duration").notNull(), // minutes

  examDate: date("exam_date"),

  isActive: boolean("is_active")
    .default(true)
    .notNull(),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull(),
});


// ======================================================
// MCQ QUESTIONS
// ======================================================

export const MCQQuestions = pgTable("mcq_questions", {
  id: serial("id").primaryKey(),

  examId: integer("exam_id")
    .notNull()
    .references(() => MCQExams.id, {
      onDelete: "cascade",
    }),

  setName: varchar("set_name", {
    length: 10,
  }).notNull().default("A"),

  questionNumber: integer("question_number")
    .notNull(),

  question: text("question")
    .notNull(),

  optionA: text("option_a")
    .notNull(),

  optionB: text("option_b")
    .notNull(),

  optionC: text("option_c")
    .notNull(),

  optionD: text("option_d")
    .notNull(),

  correctAnswer: varchar("correct_answer", {
    length: 1,
  }).notNull(),

  marks: integer("marks")
    .default(1)
    .notNull(),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull(),
});


// ======================================================
// MCQ ANSWER SHEETS
// ======================================================

export const MCQAnswerSheets = pgTable("mcq_answer_sheets", {
  id: serial("id").primaryKey(),

  examId: integer("exam_id")
    .notNull()
    .references(() => MCQExams.id, {
      onDelete: "cascade",
    }),

  studentId: integer("student_id")
    .notNull()
    .references(() => Students.id, {
      onDelete: "cascade",
    }),

  imagePath: text("image_path"),

  status: varchar("status", {
    length: 30,
  })
    .default("pending")
    .notNull(),

  // pending
  // processing
  // reviewed
  // completed
  // failed

  uploadedAt: timestamp("uploaded_at")
    .defaultNow()
    .notNull(),

  processedAt: timestamp("processed_at"),
});


// ======================================================
// MCQ STUDENT ANSWERS
// ======================================================

export const MCQStudentAnswers = pgTable("mcq_student_answers", {
  id: serial("id").primaryKey(),

  answerSheetId: integer("answer_sheet_id")
    .notNull()
    .references(() => MCQAnswerSheets.id, {
      onDelete: "cascade",
    }),

  questionId: integer("question_id")
    .notNull()
    .references(() => MCQQuestions.id, {
      onDelete: "cascade",
    }),

  selectedAnswer: varchar("selected_answer", {
    length: 1,
  }),

  isCorrect: boolean("is_correct"),

  marksObtained: integer("marks_obtained")
    .default(0)
    .notNull(),

  // OMR scanner কতটা confident
  detectionConfidence: integer(
    "detection_confidence"
  ),

  isManuallyCorrected: boolean(
    "is_manually_corrected"
  )
    .default(false)
    .notNull(),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),
}, (table) => ({
  answerUnique: unique(
    "mcq_student_answer_unique"
  ).on(
    table.answerSheetId,
    table.questionId
  ),
}));


// ======================================================
// MCQ RESULTS
// ======================================================

export const MCQResults = pgTable("mcq_results", {
  id: serial("id").primaryKey(),

  examId: integer("exam_id")
    .notNull()
    .references(() => MCQExams.id, {
      onDelete: "cascade",
    }),

  studentId: integer("student_id")
    .notNull()
    .references(() => Students.id, {
      onDelete: "cascade",
    }),

  answerSheetId: integer("answer_sheet_id")
    .references(() => MCQAnswerSheets.id, {
      onDelete: "set null",
    }),

  totalQuestions: integer("total_questions")
    .notNull(),

  correctAnswers: integer("correct_answers")
    .default(0)
    .notNull(),

  wrongAnswers: integer("wrong_answers")
    .default(0)
    .notNull(),

  skippedAnswers: integer("skipped_answers")
    .default(0)
    .notNull(),

  totalMarks: integer("total_marks")
    .notNull(),

  obtainedMarks: integer("obtained_marks")
    .default(0)
    .notNull(),

  percentage: integer("percentage"),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull(),
}, (table) => ({
  studentExamUnique: unique(
    "mcq_student_exam_unique"
  ).on(
    table.examId,
    table.studentId
  ),
}));