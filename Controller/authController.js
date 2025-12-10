import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";
// import bcrypt from "bcryptjs";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/token.js";
import crypto from "crypto";
import { log } from "console";

const prisma = new PrismaClient();
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

// User login
export const loginUser = async (req, res) => {
  try {
    // const { email, password } = req.body;

    // const user = await prisma.user.findUnique({ where: { email } });
    const { usernameOrEmail, password } = req.body;

    // Find user by email or username
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: usernameOrEmail },
          { username: usernameOrEmail },
        ],
      },
    });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Optional: Store refresh token in DB if you want to manage sessions
    // await prisma.user.update({
    //   where: { id: user.id },
    ///   data: { refreshToken },
    // });

    await prisma.user.update({
  where: { id: user.id},
  data: { refreshToken: refreshToken },
});
const userId = user.id;
const userType = user.usertype;
console.log("userType:", userType);

// ✅ Set refresh token in HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // send only over HTTPS in production
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });


    res.json({
      message: "Login successful",
      userId,
      userType,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Refresh token endpoint
export const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(400).json({ message: "Refresh token required" });

    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded)
      return res.status(403).json({ message: "Invalid or expired refresh token" });

    // Verify user exists
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    // Generate new access token
    const newAccessToken = generateAccessToken(user);

    res.json({
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ LOGOUT USER
export const logoutUser = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.refreshToken)
    return res.status(204).json({ message: "No token" });

  const refreshToken = cookies.refreshToken;
  console.log("Refresh Token on logout:", refreshToken);


  // Remove refreshToken from DB
  await prisma.user.updateMany({
    where: { refreshToken },
    data: { refreshToken: null },
  });

  // Clear cookie
  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });

  res.json({ message: "Logged out successfully" });
};

// 🟢 REQUEST PASSWORD RESET
export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "No user found with this email." });
    }

    // Generate a 24-hour JWT reset token
    const resetToken = jwt.sign({ id: user.id, email: user.email }, "lmsabcd", {
      expiresIn: "24h",
    });

    // Save token in DB
    await prisma.user.update({
      where: { email },
      data: { token: resetToken },
    });

    const resetLink = `https://gemfashion.com/reset-password?token=${resetToken}`;

    // Send reset email
    // await transporter.sendMail({
    //   from: '"GEM Support" <chandan.dews@gmail.com>',
    //   to: user.email,
    //   subject: "Reset Your GEM Account Password",
    //   template: "reset-password",
    //   context: {
    //     name: user.firstname,
    //     account: { name: "GEM" },
    //     reset_link: resetLink,
    //     support_email: "support@gemfashion.com",
    //     year: new Date().getFullYear(),
    //   },
    //   attachments: [
    //     {
    //       filename: "gem-logo.png",
    //       path: "https://i.ibb.co/5v7YTbN/gem-logo.png",
    //       cid: "logo@gem",
    //     },
    //   ],
    // });
    const name = user.firstname;
    const account = { name: "LMS" };
    const year = new Date().getFullYear();
    const support_email = "support@lms.com";
    const reset_link = resetLink;
    const info = await transporter.sendMail({
            from: '"LMS" <chandan.dews@gmail.com>',
            to: user.email,
            subject: "Reset Your LMS Account Password",
            text: "Reset Your LMS Account Password",
            html:`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Reset Password</title>
</head>
<body style="margin:0; padding:0; font-family:Arial, sans-serif; background-color:#f7f7f7;">
  <table width="100%" cellspacing="0" cellpadding="0" style="padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellspacing="0" cellpadding="0" style="background:#fff; border-radius:8px; padding:30px;">
          <tr>
            <td align="center">
              <img src="https://i.ibb.co/5v7YTbN/gem-logo.png" alt="GEM Logo" width="90" />
            </td>
          </tr>
          <tr>
            <td style="font-size:16px; color:#333;">
              <p>Hi ${name},</p>
              <p>You requested to reset your ${account.name} account password.</p>
              <p>Click the button below to set a new one:</p>
              <p style="text-align:center;">
                <a href="${reset_link}" style="background:#4F46E5; color:#fff; padding:12px 25px; border-radius:5px; text-decoration:none;">Reset My Password</a>
              </p>
              <p>This link expires in 24 hours.</p>
              <hr style="margin:20px 0;" />
              <p>Need help? Contact us at <a href="mailto:${support_email}" style="color:#4F46E5;">${support_email}</a>.</p>
              <p>Best, <br>The ${account.name} Team</p>
              <p style="font-size:13px; color:#888;">© ${year} ${account.name }. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
        });

        console.log(`✅ Email sent: ${info.messageId} for password reset to ${user.email}`);
        res.status(200).json({ success: true, resetLink, message:`Password reset link sent to ${user.email}.`, messageId: info.messageId });
    

  } catch (error) {
    console.error("❌ Error in requestPasswordReset:", error.message);
    return res.status(500).json({ message: "Failed to send reset email." });
  }
};

// 🟢 RESET PASSWORD USING TOKEN


const JWT_RESET_SECRET = process.env.JWT_RESET_SECRET || "lmsabcd";

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    console.log("token:", token);
    console.log("newPassword:", !!newPassword);

    if (!token || !newPassword) {
      return res.status(400).json({ message: "Missing token or new password." });
    }

    // 1) Verify token signature & expiry
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_RESET_SECRET);
    } catch (err) {
      // Differentiate common JWT errors
      if (err.name === "TokenExpiredError") {
        return res.status(400).json({ message: "Token expired." });
      }
      if (err.name === "JsonWebTokenError") {
        return res.status(400).json({ message: "Invalid token." });
      }
      // fallback
      console.error("JWT verify error:", err);
      return res.status(400).json({ message: "Invalid token." });
    }

    console.log("Decoded JWT:", decoded);

    if (!decoded || !decoded.email) {
      return res.status(400).json({ message: "Invalid token payload." });
    }

    // 2) Find user by email from token payload
    const user = await prisma.user.findUnique({ where: { email: decoded.email } });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // 3) Validate token matches one stored in DB (support raw token or hashed token)
    const storedToken = user.token; // adjust if you store in a different field
    let tokenMatches = false;

    if (storedToken) {
      // direct compare
      if (storedToken === token) tokenMatches = true;

      // support case where you stored a sha256(token)
      if (!tokenMatches) {
        const hashedIncoming = crypto.createHash("sha256").update(token).digest("hex");
        if (storedToken === hashedIncoming) tokenMatches = true;
      }
    }

    // If you do not store token at all (stateless), you can skip the storedToken check.
    if (!tokenMatches) {
      return res.status(400).json({ message: "Token does not match or has been invalidated." });
    }

    // 4) Hash the new password and update user (clear token)
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { email: decoded.email },
      data: {
        password: hashedPassword,
        token: null, // clear stored token so it can't be reused
        // optionally clear passwordResetExpires if you use that field
      },
    });

    return res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    console.error("❌ Error in resetPassword:", error);
    return res.status(500).json({ message: "Password reset failed." });
  }
};

