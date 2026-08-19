// controllers/omrController.js

import { calculateOMRResult } from "../services/omrService.js";

// ======================================
// CHECK MANUAL OMR
// ======================================

export const checkManualOMR = async (req, res) => {
  try {
    const {
      examCode,
      setName,
      answers,
    } = req.body;

    console.log("=================================");
    console.log("Exam Code:", examCode);
    console.log("Set Name:", setName);
    console.log("Answers:", answers);
    console.log("=================================");

    // ================================
    // VALIDATION
    // ================================

    if (!examCode) {
      return res.status(400).json({
        success: false,
        message: "Exam code is required",
      });
    }

    if (!setName) {
      return res.status(400).json({
        success: false,
        message: "Set name is required",
      });
    }

    if (!answers || typeof answers !== "object") {
      return res.status(400).json({
        success: false,
        message: "Answers are required",
      });
    }

    // ================================
    // CALCULATE RESULT
    // ================================

    const result = await calculateOMRResult({
      examCode,
      setName,
      detectedAnswers: answers,
    });

    // ================================
    // RESPONSE
    // ================================

    return res.status(200).json({
      success: true,
      examCode,
      setName,
      result,
    });

  } catch (error) {
    console.error("Manual OMR Check Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "OMR checking failed",
    });
  }
};