const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/send-otp", authController.sendOtp);
router.post("/verify-otp", authController.verifyOtp);
router.post("/login/send-otp", authController.sendLoginOtp);
router.post("/login/verify-otp", authController.verifyLoginOtp);
router.post("/google-register", authController.googleRegister);
router.get("/users", authController.getAllUsers);
router.get("/users/:id", authController.getUserById);

module.exports = router;