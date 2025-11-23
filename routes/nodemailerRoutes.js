import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();
router.use(express.json());

// const transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 587,
//     secure: false,
//     auth: {
//         user: "chandan.dews@gmail.com",
//         pass: "kmmbjqsywfuytzsg",
//     },
// });
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // use true for 465
    auth: {
        user: "chandan.dews@gmail.com",
        pass: "kmmbjqsywfuytzsg",
    },
    tls: {
        rejectUnauthorized: false, // <— allows self-signed certificates
    },
});

router.post("/send-email", async (req, res) => {
    const { to, subject, message } = req.body;
    const name = "Kaushtubh Yadav";
    const support_email = "ychandan092@gmail.com";

    if (!to || !subject || !message) {
        return res.status(400).json({ error: "Missing required fields: to, subject, or message" });
    }

    try {
        const info = await transporter.sendMail({
            from: '"LMS" <chandan.dews@gmail.com>',
            to,
            subject,
            text: message,
            html:`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Password Reset</title>
    <style>
      @media only screen and (max-width: 620px) {
        table[class="container"] {
          width: 100% !important;
          padding: 20px !important;
        }
        h2 {
          font-size: 20px !important;
        }
        a.button {
          display: block !important;
          width: 100% !important;
          text-align: center !important;
        }
      }
    </style>
  </head>
  <body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f7f7f7;">
    <table role="presentation" cellspacing="0" cellpadding="0" width="100%" style="background-color:#f7f7f7; padding:40px 0;">
      <tr>
        <td align="center">
          <table class="container" role="presentation" cellspacing="0" cellpadding="0" width="600" style="background-color:#ffffff; border-radius:8px; padding:30px;">
            
            <!-- Logo -->
            <tr>
              <td align="center" style="padding-bottom:20px;">
                <img src="https://i.ibb.co/5v7YTbN/gem-logo.png" alt="GEM Logo" width="90" style="display:block;" />
              </td>
            </tr>

           

            <!-- Signature -->
            <tr>
              <td style="font-size:16px; color:#000000; padding-bottom:20px;">
                <p><strong>Best Regards,</strong></p>
                <p>The LMS Team</p>
              </td>
            </tr>

            <!-- Greeting -->
            <tr>
              <td style="font-size:16px; color:#111; padding-bottom:10px;">
                <h2 style="margin-bottom:5px;">Hi ${name},</h2>
                <p style="line-height:1.6; color:#333333;">
                  You recently requested to reset your password for your ${name} account.<br>
                  Click the button above to reset it. This password reset link is only valid for the next 24 hours.
                </p>
              </td>
            </tr>

             <!-- Reset Button -->
            <tr>
              <td align="center" style="padding:10px 0 30px 0;">
                <a href="{reset_link}" 
                   class="button"
                   style="background-color:#4F46E5; color:#ffffff; padding:12px 25px; text-decoration:none; border-radius:5px; font-size:16px; font-weight:bold; display:inline-block;">
                  Reset my password
                </a>
              </td>
            </tr>

            <!-- Divider -->
            <tr>
              <td style="border-top:1px solid #ddd; padding-top:20px; margin-top:20px;"></td>
            </tr>

            <!-- Help Section -->
            <tr>
              <td style="font-size:15px; color:#333333;">
                <p style="font-weight:bold;">Need help?</p>
                <p>If you have any questions, please contact us by email at 
                  <a href="mailto:${support_email}" style="color:#4F46E5;">${support_email}</a>.
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`,
        });

        console.log(`✅ Email sent: ${info.messageId}`);
        res.status(200).json({ success: true,message: "Message has been sent successfully", messageId: info.messageId });
    } catch (error) {
        console.error(`❌ Error sending email: ${error.message}`);
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
