import express from "express";
import {
  getUsersForGroup,
  addUserToGroup,
  updateUserInGroup,
  getAllUsers,
  removeUserFromGroup,
} from "../Controller/userGroupController.js";

const router = express.Router();

/**
 * 📘 ROUTE DEFINITIONS
 */

// ✅ Get all users (across all groups)
router.get("/all", getAllUsers);

// ✅ Get users for a specific group
router.get("/:groupId", getUsersForGroup);

// ✅ Add user to a group
router.post("/add", addUserToGroup);

// ✅ Update user in a group (e.g., groupcourseadd)
router.put("/update", updateUserInGroup);

// ✅ Remove user from a group
router.delete("/remove", removeUserFromGroup);

export default router;
