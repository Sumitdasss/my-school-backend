import { jwtVerify } from "jose";

export const adminAuth = async (req, res, next) => {
  console.log("=================================");
  console.log("🔐 Admin Auth Middleware");
  console.log("METHOD:", req.method);
  console.log("URL:", req.originalUrl);
  console.log("=================================");

  try {
    // Authorization Header
    const authHeader = req.headers.authorization;

    console.log(
      "📨 Authorization:",
      authHeader ? "Received" : "Not Found"
    );

    // Header নেই
    if (!authHeader) {
      const error = new Error(
        "Authorization token is required"
      );

      error.statusCode = 401;

      return next(error);
    }

    // Bearer Token
    const [bearer, token] = authHeader.split(" ");

    if (bearer !== "Bearer" || !token) {
      const error = new Error(
        "Invalid authorization format"
      );

      error.statusCode = 401;

      return next(error);
    }

    console.log("🎫 Token পাওয়া গেছে");

    // JWT Secret check
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is missing");
    }

    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET
    );

    // JWT Verify


    const { payload } = await jwtVerify(
      token,
      secret,
      {
        algorithms: ["HS256"],
      }
    );

    console.log("✅ JWT Verified");
    console.log("👤 Admin Payload:", payload);

    // Role check
    if (
      payload.role !== "admin" &&
      payload.role !== "super_admin"
    ) {
      console.log(
        "❌ Invalid Admin Role:",
        payload.role
      );

      const error = new Error(
        "Admin access required"
      );

      error.statusCode = 403;

      return next(error);
    }

    // Admin data request-এ রাখা
    req.admin = payload;

    console.log(
      "👑 Admin Authorized Successfully"
    );

    console.log(
      "➡️ Next Controller-এ যাচ্ছে"
    );

    next();

  } catch (error) {
    console.error(
      "❌ Admin Auth Error:",
      error.message
    );

    error.statusCode = 401;

    next(error);
  }
};