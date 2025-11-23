import { Router } from "express";
import {
  createUser,
  updateUser,
  showUser,
  getAllUsers,
  deleteUser,
  loginUser,
  logoutUser
} from "../Controller/UserController.js";

const router = Router();

router.get("/all", getAllUsers);
router.get("/:id", showUser);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);


export default router;