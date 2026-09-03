import { db } from "../db/index.js";
import { Notices } from "../db/schema.js";

export const addNotice = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const {
      title,
      slug,
      category,
      date,
      urgent,
      shortDescription,
      description,
    } = req.body || {};

    const file = req.file;

    await db.insert(Notices).values({
      title,
      slug,
      category,
      date,
      urgent: urgent === "true",
      shortDescription,
      description,
      attachment: file ? file.path : null,
    });

    res.status(201).json({
      success: true,
      message: "Notice added successfully",
    });

  } catch (error) {
    console.error("❌ Add Notice Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getNotices = async (req, res) => {
  try {
    const notices = await db.select().from(Notices);

  const fixedNotices = notices.map((notice) => {
      if (notice.attachment && !notice.attachment.includes(".pdf") 
          && !notice.attachment.includes(".doc")) {
        return {
          ...notice,
          attachment: `${notice.attachment}.pdf`, 
        };
      }
      return notice;
    });






    res.status(200).json({
      success: true,
      data: fixedNotices,
    });

  } catch (error) {
    console.error("❌ Get Notices Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};