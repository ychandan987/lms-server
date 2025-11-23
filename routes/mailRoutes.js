import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// POST /api/send-email
router.post("/send-email", async (req, res) => {
  const { to, name, subject, message } = req.body;

  // Basic validation
  if (!to || !name) {
    return res.status(400).json({ success: false, message: "Recipient details missing" });
  }

  try {
    const response = await axios.post(
      "https://api.mailersend.com/v1/email",
      {
        from: {
          email: "sixsagepath83@gmail.com", // must match your verified domain
          name: "Kaushtubh Yadav",
        },
        to: [
          {
            email: to,
            name: name,
          },
        ],
        subject: subject || "Test Email from MailerSend",
        text: message || `Hi ${name}, this is a test email from MailerSend.`,
        html:
          message ||
          `<p>Hi <strong>${name}</strong>,</p><p>This is a <b>test email</b> sent using MailerSend API.</p>`,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.MAILERSEND_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Email sent successfully:", response.data);
    res.status(200).json({ success: true, data: response.data });
  } catch (error) {
    console.error(
      "❌ Failed to send email:",
      error.response?.data || error.message
    );

    res.status(500).json({
      success: false,
      message:
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "Unknown error occurred",
    });
  }
});

export default router;

