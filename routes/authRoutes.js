import express from "express";
import { loginUser, refreshAccessToken,logoutUser, requestPasswordReset,resetPassword} from "../Controller/authController.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/refresh", refreshAccessToken);
router.post("/logout", logoutUser);
router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password/:token", resetPassword);
export default router;
