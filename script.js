import bcrypt from "bcrypt";
import { db } from "./db/index.js";
import { Admin } from "./db/schema.js";

async function createAdmin() {

  const password = "01880851638 Sumitdas";

  const hashedPassword =
    await bcrypt.hash(password, 10);

  await db.insert(Admin).values({
    username: "Sumit Das",
    email: "nodidas4612@gmail.com",
    password: hashedPassword,
    fullName: "Sumit Das",
    role: "super_admin",
  });

  console.log("✅ Super Admin তৈরি হয়েছে!");

  process.exit(0);
}

createAdmin();