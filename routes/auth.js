import express from "express";
import { studentLogin } from "../controler/authController.js";
import { Parentlogin } from "../controler/Parentlogin.js";
import { Teacherlogin } from "../controler/Teacherlogin.js";

const router = express.Router();

router.post("/student-login", studentLogin);
router.post("/Parent-login", Parentlogin);
router.post("/Teacher-login", Teacherlogin);

export default router;