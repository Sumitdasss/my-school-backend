import nodemailer from "nodemailer";


// =====================================================
// GMAIL TRANSPORTER
// =====================================================

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


// =====================================================
// CHECK SMTP CONNECTION
// =====================================================

try {
  await transporter.verify();

  console.log("✅ Gmail SMTP Server Ready");

} catch (error) {

  console.error(
    "❌ Gmail SMTP Error:",
    error.message
  );
}


// =====================================================
// SEND PAYMENT APPROVED EMAIL
// =====================================================

export const sendAdmissionStatusEmail = async ({
  email,
  fullName,
  status,
}) => {
  if (!email) {
    console.log("❌ Student email পাওয়া যায়নি");

    return {
      success: false,
      message: "Student has no email",
    };
  }

  let subject = "";
  let title = "";
  let message = "";
  let statusColor = "";

  if (status === "approved") {
    subject = "🎉 Admission Application Approved";
    title = "Admission Application Approved ✅";
    statusColor = "#16a34a";

    message = `
      অভিনন্দন <strong>${fullName}</strong>!<br><br>

      আপনার Online Admission Application সফলভাবে 
      <strong>Approved</strong> হয়েছে। 🎉<br><br>

      আপনার ভর্তি প্রক্রিয়ার পরবর্তী ধাপ এবং প্রয়োজনীয়
      তথ্যের জন্য স্কুল কর্তৃপক্ষের নির্দেশনা অনুসরণ করুন।
    `;
  }

  if (status === "rejected") {
    subject = "Admission Application Update";
    title = "Admission Application Rejected";
    statusColor = "#dc2626";

    message = `
      Dear <strong>${fullName}</strong>,<br><br>

      দুঃখিত, আপনার Online Admission Application
      বর্তমানে <strong>Rejected</strong> হয়েছে।<br><br>

      আপনার আবেদনের বিষয়ে আরও তথ্য জানতে
      স্কুল কর্তৃপক্ষের সাথে যোগাযোগ করতে পারেন।
    `;
  }

  if (!subject) {
    return {
      success: false,
      message: "Email is not required for this status",
    };
  }

  try {
    const mailOptions = {
      from: `"Goalkhali High School" <${process.env.EMAIL_USER}>`,
      to: email,
      subject,

      html: `
<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8">
  <title>${title}</title>
</head>

<body
  style="
    margin:0;
    padding:0;
    background:#f1f5f9;
    font-family:Arial,sans-serif;
  "
>

  <div
    style="
      max-width:600px;
      margin:30px auto;
      background:#ffffff;
      border-radius:16px;
      overflow:hidden;
      border:1px solid #e2e8f0;
    "
  >

    <!-- HEADER -->

    <div
      style="
        background:#D4AF37;
        padding:30px 20px;
        text-align:center;
        color:white;
      "
    >

      <h1 style="margin:0;">
        Goalkhali High School
      </h1>

      <p style="margin-top:10px;">
        Online Admission
      </p>

    </div>


    <!-- BODY -->

    <div
      style="
        padding:35px 30px;
        color:#334155;
      "
    >

      <h2
        style="
          color:${statusColor};
          margin-top:0;
        "
      >
        ${title}
      </h2>

      <p style="font-size:16px; line-height:1.7;">
        ${message}
      </p>


      <!-- STATUS -->

      <div
        style="
          margin-top:25px;
          padding:20px;
          background:#f8fafc;
          border-radius:10px;
          text-align:center;
        "
      >

        <p
          style="
            margin:0 0 8px 0;
            color:#64748b;
          "
        >
          Application Status
        </p>

        <strong
          style="
            color:${statusColor};
            font-size:22px;
          "
        >
          ${status.toUpperCase()}
        </strong>

      </div>


      <p
        style="
          margin-top:30px;
          line-height:1.6;
        "
      >
        ধন্যবাদ,<br>
        <strong>Goalkhali High School</strong>
      </p>

    </div>


    <!-- FOOTER -->

    <div
      style="
        background:#f8fafc;
        padding:18px;
        text-align:center;
        color:#94a3b8;
        font-size:13px;
      "
    >

      This is an automated email.
      Please do not reply directly to this email.

    </div>

  </div>

</body>

</html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("✅ Admission status email sent");
    console.log("To:", email);
    console.log("Status:", status);
    console.log("Message ID:", info.messageId);

    return {
      success: true,
      message: "Admission status email sent",
      messageId: info.messageId,
    };

  } catch (error) {

    console.error("❌ Admission email failed:", error.message);

    return {
      success: false,
      message: "Admission email failed",
      error: error.message,
    };
  }
};