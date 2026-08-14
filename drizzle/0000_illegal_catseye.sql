CREATE TABLE "admins" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" text NOT NULL,
	"full_name" varchar(255) NOT NULL,
	"role" varchar(50) DEFAULT 'admin',
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "admins_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "AdmitCards" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_id" integer NOT NULL,
	"exam_name" varchar(100) NOT NULL,
	"exam_year" integer NOT NULL,
	"center" varchar(255) NOT NULL,
	"exam_date" date NOT NULL,
	"exam_time" varchar(50) NOT NULL,
	"room" varchar(50) NOT NULL,
	"seat_no" varchar(50) NOT NULL,
	"status" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "Attendance" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_id" integer NOT NULL,
	"attendance_date" date NOT NULL,
	"status" varchar(10) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "unique_student_attendance" UNIQUE("student_id","attendance_date")
);
--> statement-breakpoint
CREATE TABLE "ClassRoutine" (
	"id" serial PRIMARY KEY NOT NULL,
	"class_name" varchar(20) NOT NULL,
	"section" varchar(10) NOT NULL,
	"shift" varchar(20) NOT NULL,
	"day" varchar(20) NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "Exams" (
	"id" serial PRIMARY KEY NOT NULL,
	"exam_name" varchar(50) NOT NULL,
	"exam_year" integer NOT NULL,
	"class" varchar(20) NOT NULL,
	"section" varchar(10) NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "Fees" (
	"id" serial PRIMARY KEY NOT NULL,
	"class" varchar(20) NOT NULL,
	"fee_type" varchar(100) NOT NULL,
	"amount" integer NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "LoginHistory" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_id" integer NOT NULL,
	"login_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mcq_answer_sheets" (
	"id" serial PRIMARY KEY NOT NULL,
	"exam_id" integer NOT NULL,
	"student_id" integer NOT NULL,
	"image_path" text,
	"status" varchar(30) DEFAULT 'pending' NOT NULL,
	"uploaded_at" timestamp DEFAULT now() NOT NULL,
	"processed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "mcq_exams" (
	"id" serial PRIMARY KEY NOT NULL,
	"exam_name" varchar(255) NOT NULL,
	"subject" varchar(100) NOT NULL,
	"class_name" varchar(50) NOT NULL,
	"section" varchar(20),
	"total_marks" integer NOT NULL,
	"duration" integer NOT NULL,
	"exam_date" date,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mcq_questions" (
	"id" serial PRIMARY KEY NOT NULL,
	"exam_id" integer NOT NULL,
	"question_number" integer NOT NULL,
	"question" text NOT NULL,
	"option_a" text NOT NULL,
	"option_b" text NOT NULL,
	"option_c" text NOT NULL,
	"option_d" text NOT NULL,
	"correct_answer" varchar(1) NOT NULL,
	"marks" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "mcq_exam_question_number_unique" UNIQUE("exam_id","question_number")
);
--> statement-breakpoint
CREATE TABLE "mcq_results" (
	"id" serial PRIMARY KEY NOT NULL,
	"exam_id" integer NOT NULL,
	"student_id" integer NOT NULL,
	"answer_sheet_id" integer,
	"total_questions" integer NOT NULL,
	"correct_answers" integer DEFAULT 0 NOT NULL,
	"wrong_answers" integer DEFAULT 0 NOT NULL,
	"skipped_answers" integer DEFAULT 0 NOT NULL,
	"total_marks" integer NOT NULL,
	"obtained_marks" integer DEFAULT 0 NOT NULL,
	"percentage" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "mcq_student_exam_unique" UNIQUE("exam_id","student_id")
);
--> statement-breakpoint
CREATE TABLE "mcq_student_answers" (
	"id" serial PRIMARY KEY NOT NULL,
	"answer_sheet_id" integer NOT NULL,
	"question_id" integer NOT NULL,
	"selected_answer" varchar(1),
	"is_correct" boolean,
	"marks_obtained" integer DEFAULT 0 NOT NULL,
	"detection_confidence" integer,
	"is_manually_corrected" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "mcq_student_answer_unique" UNIQUE("answer_sheet_id","question_id")
);
--> statement-breakpoint
CREATE TABLE "notices" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"category" varchar(100) NOT NULL,
	"date" varchar(100) NOT NULL,
	"urgent" boolean DEFAULT false,
	"short_description" text,
	"description" text,
	"attachment" varchar(500),
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "notices_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "OTP" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"otp" varchar(6) NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "Parent" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(20) NOT NULL,
	"child_email" varchar(255) NOT NULL,
	"child_name" varchar(255) NOT NULL,
	"child_class" varchar(50) NOT NULL,
	"child_roll" varchar(50) NOT NULL,
	"password" varchar(255) NOT NULL,
	"photo" varchar(500),
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "Parent_email_unique" UNIQUE("email"),
	CONSTRAINT "Parent_phone_unique" UNIQUE("phone")
);
--> statement-breakpoint
CREATE TABLE "ParentLoginHistory" (
	"id" serial PRIMARY KEY NOT NULL,
	"Parent_id" integer NOT NULL,
	"login_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "PaymentItems" (
	"id" serial PRIMARY KEY NOT NULL,
	"payment_id" integer NOT NULL,
	"title" varchar(100) NOT NULL,
	"amount" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Payments" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_id" integer NOT NULL,
	"parent_id" integer,
	"amount" integer NOT NULL,
	"fee_type" varchar(100) NOT NULL,
	"payment_method" varchar(50) DEFAULT 'SSLCommerz',
	"transaction_id" varchar(255),
	"status" varchar(20) DEFAULT 'Pending',
	"payment_date" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "Payments_transaction_id_unique" UNIQUE("transaction_id")
);
--> statement-breakpoint
CREATE TABLE "Results" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_id" integer NOT NULL,
	"exam_id" integer NOT NULL,
	"subject_id" integer NOT NULL,
	"teacher_id" integer,
	"marks_obtained" integer NOT NULL,
	"total_marks" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "Results_student_id_exam_id_subject_id_unique" UNIQUE("student_id","exam_id","subject_id")
);
--> statement-breakpoint
CREATE TABLE "RoutinePeriod" (
	"id" serial PRIMARY KEY NOT NULL,
	"routine_id" integer NOT NULL,
	"period" integer NOT NULL,
	"start_time" varchar(20) NOT NULL,
	"end_time" varchar(20) NOT NULL,
	"subject" varchar(100) NOT NULL,
	"teacher" varchar(100) NOT NULL,
	"room" varchar(50),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "Students" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_name" varchar(255) NOT NULL,
	"father_name" varchar(255) NOT NULL,
	"mother_name" varchar(255) NOT NULL,
	"date_of_birth" timestamp NOT NULL,
	"phone" varchar(20) NOT NULL,
	"roll_number" varchar(50) NOT NULL,
	"email" varchar(255) NOT NULL,
	"parent_id" integer,
	"password" varchar(255) NOT NULL,
	"photo" varchar(500),
	"class" varchar(20) NOT NULL,
	"section" varchar(10) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "Students_phone_unique" UNIQUE("phone"),
	CONSTRAINT "Students_roll_number_unique" UNIQUE("roll_number"),
	CONSTRAINT "Students_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "Subjects" (
	"id" serial PRIMARY KEY NOT NULL,
	"subjectname" varchar(100) NOT NULL,
	"class" varchar(20) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Teacher" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_name" varchar(255) NOT NULL,
	"date_of_birth" timestamp NOT NULL,
	"phone" varchar(20) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" text NOT NULL,
	"photo" text,
	CONSTRAINT "Teacher_phone_unique" UNIQUE("phone"),
	CONSTRAINT "Teacher_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "TeacherAssignments" (
	"id" serial PRIMARY KEY NOT NULL,
	"teacher_id" integer NOT NULL,
	"subject_id" integer NOT NULL,
	"class" varchar(20) NOT NULL,
	"section" varchar(10) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "TeacherLoginHistory" (
	"id" serial PRIMARY KEY NOT NULL,
	"Teacher_id" integer NOT NULL,
	"login_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "AdmitCards" ADD CONSTRAINT "AdmitCards_student_id_Students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."Students"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_student_id_Students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."Students"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "LoginHistory" ADD CONSTRAINT "LoginHistory_student_id_Students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."Students"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mcq_answer_sheets" ADD CONSTRAINT "mcq_answer_sheets_exam_id_mcq_exams_id_fk" FOREIGN KEY ("exam_id") REFERENCES "public"."mcq_exams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mcq_answer_sheets" ADD CONSTRAINT "mcq_answer_sheets_student_id_Students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."Students"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mcq_questions" ADD CONSTRAINT "mcq_questions_exam_id_mcq_exams_id_fk" FOREIGN KEY ("exam_id") REFERENCES "public"."mcq_exams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mcq_results" ADD CONSTRAINT "mcq_results_exam_id_mcq_exams_id_fk" FOREIGN KEY ("exam_id") REFERENCES "public"."mcq_exams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mcq_results" ADD CONSTRAINT "mcq_results_student_id_Students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."Students"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mcq_results" ADD CONSTRAINT "mcq_results_answer_sheet_id_mcq_answer_sheets_id_fk" FOREIGN KEY ("answer_sheet_id") REFERENCES "public"."mcq_answer_sheets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mcq_student_answers" ADD CONSTRAINT "mcq_student_answers_answer_sheet_id_mcq_answer_sheets_id_fk" FOREIGN KEY ("answer_sheet_id") REFERENCES "public"."mcq_answer_sheets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mcq_student_answers" ADD CONSTRAINT "mcq_student_answers_question_id_mcq_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."mcq_questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ParentLoginHistory" ADD CONSTRAINT "ParentLoginHistory_Parent_id_Parent_id_fk" FOREIGN KEY ("Parent_id") REFERENCES "public"."Parent"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "PaymentItems" ADD CONSTRAINT "PaymentItems_payment_id_Payments_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."Payments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Payments" ADD CONSTRAINT "Payments_student_id_Students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."Students"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Payments" ADD CONSTRAINT "Payments_parent_id_Parent_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."Parent"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "RoutinePeriod" ADD CONSTRAINT "RoutinePeriod_routine_id_ClassRoutine_id_fk" FOREIGN KEY ("routine_id") REFERENCES "public"."ClassRoutine"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Students" ADD CONSTRAINT "Students_parent_id_Parent_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."Parent"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "TeacherAssignments" ADD CONSTRAINT "TeacherAssignments_teacher_id_Teacher_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."Teacher"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "TeacherAssignments" ADD CONSTRAINT "TeacherAssignments_subject_id_Subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."Subjects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "TeacherLoginHistory" ADD CONSTRAINT "TeacherLoginHistory_Teacher_id_Teacher_id_fk" FOREIGN KEY ("Teacher_id") REFERENCES "public"."Teacher"("id") ON DELETE no action ON UPDATE no action;