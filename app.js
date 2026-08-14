import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

// Routes

import authRoute from "./routes/auth.js";
import studentRoute from "./routes/Allrouts.js";

app.use("/api/student", studentRoute);
app.use("/api/ParentRegistar", studentRoute);
app.use("/api/TeacherRegistar", studentRoute);
app.use("/api", studentRoute);
app.use("/api/subject", studentRoute);
app.use("/api/Result", studentRoute);
app.use("/api/Teacherassing", studentRoute);
app.use("/api/Exam", studentRoute);
app.use("/api/Student", studentRoute);
app.use("/api/ALLMCQEXAM", studentRoute);
app.use("/api/mcq-questions", studentRoute);


app.use("/api/auth", authRoute);


export default app;