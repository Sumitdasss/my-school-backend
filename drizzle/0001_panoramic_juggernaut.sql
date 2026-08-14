ALTER TABLE "mcq_questions" DROP CONSTRAINT "mcq_exam_question_number_unique";--> statement-breakpoint
ALTER TABLE "mcq_questions" ADD COLUMN "set_name" varchar(10) DEFAULT 'A' NOT NULL;