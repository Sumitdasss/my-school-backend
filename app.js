import express from "express";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: [
      "https://my-school-hc7r.vercel.app",
      "http://localhost:3000",
    ],

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

app.use(express.json());

// Routes

import authRoute from "./routes/auth.js";
import studentRoute from "./routes/Allrouts.js";
import { adminAuth } from "./middleware/adminauth.js";

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
app.use("/api/studentlogin", studentRoute);
app.use("/api/chagepassword", studentRoute);
app.use("/api/adminlogin",studentRoute);
app.use("/api/admintest",studentRoute);
app.use("/api/omr", studentRoute);
app.use("/api/MCQresult", studentRoute);
app.use("/api/addmition", studentRoute);
app.use("/api/addnotice", studentRoute);
app.use("/api/auth", authRoute);



app.use((req, res, next) => {
  const error = new Error( `Route not found: ${req.method} ${req.originalUrl}`);
  error.status = 404;
  next(error);

})

app.use((err,req,res,next)=>{
  const statusCode  = err.status ||err.statusCode|| 500;
  res.status(statusCode).json({ message: err.message||"Internal Server Error",success:false });
});

export default app;