// import { Type } from "@prisma/client";
import prisma from "../DB/db.config.js";   // ✅ only once

import pkg from "@prisma/client";
const { Prisma } = pkg;
const { Type } = Prisma;                   // enums

// ❌ DO NOT do this again:
// const prisma = new PrismaClient();
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

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

// 🟢 CREATE USER
export const createUser = async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      email,
      bio,
      username,
      password,
      language,
      usertype, // frontend sends this (not userType)
      gender,
      active,
      inActive,
      lastLogin,
    } = req.body;

    // Check for duplicate email
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: "Email already taken" });
    }
    var token = jwt.sign({
            username: req.body.username,
            email: req.body.email
          }, 'lmsabcd', {
            expiresIn: "2 days"
          });
    const b_password = await bcrypt.hash(password, 10);
    const token_data  = token;
    console.log("b_password: ", b_password);
    console.log("token_data: ", token_data);
    console.log("email : ",email);
    console.log("pass : ",password);
    
    const company = "LMS";
    const login_url = "http://localhost:5173/login";

    const newUser = await prisma.user.create({
      data: {
     firstname: firstname,
    lastname: lastname,
    email: email,
    bio: bio,
    username: username,
    password: b_password,
    language: language,
    usertype: usertype,
    gender: gender,
    active: false,
    inActive: false, // ✅ correct key name (case-sensitive)
    token: token_data,
    lastLogin: lastLogin,
  },
});

  // Fetch all users, newest first
    const allUsers = await prisma.user.findMany({
      orderBy: { created_at: "desc" },
    });

     const info = await transporter.sendMail({
            from: '"LMS" <chandan.dews@gmail.com>',
            to: email,
            subject: "Your Account Login Details",
                html:`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Your Account Login Details</title>
  <style>
    body { margin:0; padding:0; background-color:#f4f4f6; font-family: Arial, Helvetica, sans-serif; }
    table { border-collapse:collapse; }
    a { color:#0077b6; text-decoration:none; }
    .button {
      display:inline-block; padding:12px 20px;
      border-radius:6px; background:#0077b6;
      color:#ffffff; font-weight:600; text-decoration:none;
    }
  </style>
</head>

<body>
  <table width="100%" bgcolor="#f4f4f6" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:28px 16px;">

        <!-- Container -->
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px;">
          
          <!-- Header with Logo -->
          <tr>
            <td style="padding:24px; text-align:center; background:#ffffff;">
              <img src="https://www.canva.com/design/DAG5irtaxHc/OipCBmNppl3UPe29r2oyvg/view?utm_content=DAG5irtaxHc&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h9010ab7eae" alt="LMS Logo"
                   width="120" style="display:block; margin:0 auto 10px auto;" />
              <h2 style="margin:0; font-size:20px; color:#0a0a0a;">
              Hi ${firstname},
              </h2>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:20px 24px; color:#374151; font-size:16px; line-height:1.5;">
              <p style="margin:0 0 12px 0;">
                Your account has been created successfully. Please use the credentials below to log in:
              </p>

              <table width="100%" style="margin:12px 0;">
                <tr>
                  <td style="padding:12px; background:#f1f9ff; border-radius:6px; font-family:monospace; color:#0f172a;">
                    <strong>Email:</strong> ${email}<br />
                    <strong>Password:</strong> ${password}  
                  </td>
                </tr>
              </table>

              <p style="margin:12px 0;">
                For security, please log in and update your password at your earliest convenience.
              </p>

              <p style="margin:18px 0 0;">
                <a href="${login_url}" target="_blank" style="background:#4F46E5; color:#fff; padding:12px 25px; border-radius:5px; text-decoration:none;">Log In</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 24px; background:#f9fbfd; color:#6b7280; font-size:14px;">
              Regards,<br />
              <strong>${company}</strong>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>
`,
        });

        console.log(`✅ Email sent: ${info.messageId} for account creation to ${email}`);
        return res.status(200).json({ success: true, data: newUser, message:`Account creation details sent to ${email}.`, messageId: info.messageId });

    // return res.status(200).json({ message: "User created", data: newUser, allUsers, });
  } catch (error) {
    console.error("❌ Create user error:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

// 🟡 SHOW USER
export const showUser = async (req, res) => {
  try { 
    const id = parseInt(req.params.id);
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    console.error("❌ Show user error:", error);
    res.status(500).json({ message: "Failed to fetch user" });
  }
};

// 🔵 GET ALL USERS
export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        firstname: true,
        lastname: true,
        usertype: true,
        email: true,
        gender:true,
        lastLogin: true,
      },
    });

    console.log("Fetched users:", users);
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// 🟠 UPDATE USER
export const updateUser = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const {
      firstname,
      lastname,
      email,
      bio,
      username,
      password,
      language,
      usertype, // frontend sends this
      gender,
      active,
      inActive,
    } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        firstname,
        lastname,
        email,
        bio,
        username,
        password,
        language,
        usertype,
        gender,
        active: active === true || active === "true" || active === "on",
        inActive: inActive 
      },
    });

    return res.status(200).json({
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("❌ Update user error:", error);
    res.status(500).json({ message: "Failed to update user", error });
  }
};

// 🔴 DELETE USER
export const deleteUser = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const existingUser = await prisma.user.findUnique({ where: { id } });

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    await prisma.user.delete({ where: { id } });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("❌ Delete user error:", error);
      res.status(500).json({ message: "Internal server error", error });
  }
};

// Login User

export const loginUser = async (req, res) => {
  try {
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

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Success: return user data (or token)
    return res.status(200).json({
      message: "Login successful",
      token: user.token,
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Logout User
export const logoutUser = async (req, res) => {
  try {
    const cookies = req.cookies;

    if (!cookies?.refreshToken)
      return res.status(204).json({ message: "No token found" });

    const refreshToken = cookies.refreshToken;

    const user = await prisma.user.findUnique({
      where: { refreshToken },
    });

    if (!user) {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "development",
      });
      return res.status(204).json({ message: "No user found for this token" });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: null },
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "development",
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Server error during logout" });
  }
};

export const getUserStatusCounts = async (req, res) => {
  try {
    // Use Prisma groupBy to count users by status
    const statusCounts = await prisma.user.groupBy({
      by: ["status"],
      _count: { status: true },
    });

    // Format counts to make sure all statuses are present
    const counts = {
      active: 0,
      inactive: 0,
      new: 0,
      pending: 0,
    };

    statusCounts.forEach((entry) => {
      counts[entry.status.toLowerCase()] = entry._count.status;
    });

    res.status(200).json({
      success: true,
      data: counts,
    });
  } catch (error) {
    console.error("Error fetching user counts:", error);
    res.status(500).json({ success: false, message: "Failed to fetch user status counts" });
  }
};