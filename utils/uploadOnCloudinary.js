import fs from "fs";
// import prisma from "../prismaClient.js";
// import { PrismaClient } from "@prisma/client";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
import cloudinary from "../config/cloudinary.js";
import { title } from "process";

export const uploadOnCloudinary = async (localFilePath, userId = null) => {
  try {
    if (!localFilePath) return null;

    // ✅ Upload file to Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    console.log("response from cloudinary:", response);
    

    // ✅ Save file info to DB via Prisma
    const savedFile = await prisma.video.create({
      data: {
        title: response.original_filename,
        url: response.secure_url,
        uploadedBy: userId,
      },
    });

    // ✅ Delete local temp file
    fs.unlinkSync(localFilePath);

    console.log("✅ File uploaded and saved:", savedFile);
    return savedFile;

  } catch (error) {
    console.error("❌ Upload failed:", error);
    if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath); // Clean up temp file
    return null;
  }
};
