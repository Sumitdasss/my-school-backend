import jwt from "jsonwebtoken";

export const studentAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Login required",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    if (decoded.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Only students can submit MCQ exam",
      });
    }

    req.studentId = decoded.studentId;

    next();

  } catch (error) {
    console.error("Student Auth Error:", error);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};




export const studentAuth22 = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Authorization header আছে কিনা
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Token missing",
      });
    }

    // Bearer token আছে কিনা
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Invalid token format",
      });
    }

    // Token verify
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Student token কিনা check
    if (decoded.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Student access only",
      });
    }
   
    // Request এ student information রাখা
    req.student = decoded;
    req.studentId = decoded.studentId;

    next();

  } catch (error) {

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired. Please login again",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Authentication failed",
    });
  }
};

export const parentAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Token আছে কিনা
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Token missing",
      });
    }

    // Bearer token বের করা
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Invalid token format",
      });
    }

    // JWT verify
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Parent token কিনা
    if (decoded.role !== "parent") {
      return res.status(403).json({
        success: false,
        message: "Parent access only",
      });
    }

    // Parent information request-এ রাখা
    req.parent = decoded;
    req.parentId = Number(decoded.parentId);
    req.userId = Number(decoded.parentId);

    // ID valid কিনা
    if (!Number.isInteger(req.parentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid parent ID",
      });
    }

    next();

  } catch (error) {

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired. Please login again",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    console.error("Parent Auth Error:", error);

    return res.status(500).json({
      success: false,
      message: "Authentication failed",
    });
  }
};

export const teacherAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Token missing",
      });
    }

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Invalid token format",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Teacher কিনা check
    if (decoded.role !== "teacher") {
      return res.status(403).json({
        success: false,
        message: "Teacher access only",
      });
    }

    const teacherId = Number(decoded.id);

    if (!Number.isInteger(teacherId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid teacher ID",
      });
    }

    req.teacher = decoded;
    req.teacherId = teacherId;
    req.userId = teacherId;

    next();

  } catch (error) {

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired. Please login again",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    console.error("Teacher Auth Error:", error);

    return res.status(500).json({
      success: false,
      message: "Authentication failed",
    });
  }
};