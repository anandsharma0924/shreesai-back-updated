'use strict';

require("dotenv").config();
const { User } = require("../models");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const twilio = require("twilio");
const { OAuth2Client } = require("google-auth-library");

const {
  JWT_SECRET = "change_me_in_prod",
  GOOGLE_CLIENT_ID,
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_PHONE_NUMBER,
} = process.env;

if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
  console.error("❌ Twilio credentials are not set in .env");
  process.exit(1);
}


const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID || "");
const twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

const otpStore = new Map(); // Temporary in-memory store for OTPs {phone: {otp, expires}}

const UPLOAD_DIR = path.join(__dirname, "..", "Uploads");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}_${file.originalname.replace(/\s+/g, "_")}`),
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype && file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

const uploadMiddleware = upload.single("profilePhoto");

const normalisePhone = (raw) => {
  if (!raw) return null;
  let p = String(raw).trim().replace(/[^\d\+]/g, "");
  if (p.startsWith("+")) return p;
  if (/^\d{10}$/.test(p)) return "+91" + p;
  if (/^\d{11,15}$/.test(p)) return "+" + p;
  return null;
};

function signToken(user) {
  return jwt.sign(
    { id: user.id, phoneNumber: user.phoneNumber, email: user.email },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

exports.sendOtp = async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    console.log("sendOtp: Received", { phoneNumber });
    if (!phoneNumber) {
      console.error("sendOtp: Missing phoneNumber");
      return res.status(400).json({ success: false, error: "phoneNumber is required" });
    }

    const normalizedPhone = normalisePhone(phoneNumber);
    if (!normalizedPhone || !/^[0-9\+]{10,15}$/.test(normalizedPhone)) {
      console.error("sendOtp: Invalid phoneNumber format", phoneNumber);
      return res.status(400).json({ success: false, error: "Invalid phoneNumber format" });
    }

    let user = await User.findOne({ where: { phoneNumber: normalizedPhone } });
    if (!user) {
      user = await User.create({
        username: null,
        email: null,
        phoneNumber: normalizedPhone,
        isPhoneVerified: false,
      });
      console.log("sendOtp: User created:", user.id);
    } else {
      console.log("sendOtp: User found:", user.id);
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 5 * 60 * 1000; // 5 minutes
    otpStore.set(normalizedPhone, { otp, expires });

    await twilioClient.messages.create({
      body: `Your OTP for registration is ${otp}. It expires in 5 minutes.`,
      from: TWILIO_PHONE_NUMBER,
      to: normalizedPhone,
    });
    console.log("sendOtp: OTP sent via Twilio");

    return res.json({
      success: true,
      message: "OTP sent to your phone number via SMS",
      userId: user.id,
    });
  } catch (err) {
    console.error("sendOtp error:", {
      name: err.name,
      message: err.message,
      stack: err.stack,
      details: err.errors || err,
    });
    return res.status(500).json({
      success: false,
      error: "Failed to send OTP",
      details: err.message,
    });
  }
};

exports.verifyOtp = (req, res) => {
  uploadMiddleware(req, res, async (uploadErr) => {
    try {
      if (uploadErr) {
        console.error("verifyOtp: Upload error:", uploadErr.message);
        return res.status(400).json({
          success: false,
          error: "Invalid profilePhoto",
          details: uploadErr.message,
        });
      }
      const { phoneNumber, otp, username, email } = req.body;
      if (!phoneNumber || !otp) {
        console.error("verifyOtp: Missing required fields");
        return res.status(400).json({
          success: false,
          error: "phoneNumber and otp are required",
        });
      }
      const normalizedPhone = normalisePhone(phoneNumber);
      if (!normalizedPhone || !/^[0-9\+]{10,15}$/.test(normalizedPhone)) {
        console.error("verifyOtp: Invalid phoneNumber:", phoneNumber);
        return res.status(400).json({ success: false, error: "Invalid phoneNumber format" });
      }

      const stored = otpStore.get(normalizedPhone);
      if (!stored || stored.expires < Date.now() || stored.otp !== otp) {
        console.error("verifyOtp: Invalid or expired OTP");
        return res.status(401).json({
          success: false,
          error: "Invalid or expired OTP",
        });
      }
      otpStore.delete(normalizedPhone);

      let user = await User.findOne({ where: { phoneNumber: normalizedPhone } });
      if (!user) {
        user = await User.create({
          username: username || null,
          email: email || null,
          phoneNumber: normalizedPhone,
          isPhoneVerified: true,
        });
        console.log("verifyOtp: User created:", user.id);
      } else {
        user.isPhoneVerified = true;
        if (username) user.username = username;
        if (email) user.email = email;
        if (req.file) user.profilePhoto = `/uploads/${req.file.filename}`;
        await user.save();
        console.log("verifyOtp: User updated:", user.id);
      }

      const token = signToken(user);
      return res.json({
        success: true,
        message: "OTP verified and user registered successfully",
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          phoneNumber: user.phoneNumber,
          profilePhoto: user.profilePhoto,
          isPhoneVerified: user.isPhoneVerified,
        },
      });
    } catch (err) {
      console.error("verifyOtp error:", {
        name: err.name,
        message: err.message,
        stack: err.stack,
        details: err.errors || err,
      });
      return res.status(500).json({
        success: false,
        error: "Failed to verify OTP",
        details: err.message,
      });
    }
  });
};

exports.sendLoginOtp = async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    console.log("sendLoginOtp: Received", { phoneNumber });
    if (!phoneNumber) {
      console.error("sendLoginOtp: Missing phoneNumber");
      return res.status(400).json({
        success: false,
        error: "phoneNumber is required",
      });
    }

    const normalizedPhone = normalisePhone(phoneNumber);
    if (!normalizedPhone || !/^[0-9\+]{10,15}$/.test(normalizedPhone)) {
      console.error("sendLoginOtp: Invalid phoneNumber:", phoneNumber);
      return res.status(400).json({ success: false, error: "Invalid phoneNumber format" });
    }
    const user = await User.findOne({ where: { phoneNumber: normalizedPhone } });
    if (!user) {
      console.error("sendLoginOtp: User not found for phoneNumber:", normalizedPhone);
      return res.status(404).json({ success: false, error: "User not registered. Please sign up first." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 5 * 60 * 1000; // 5 minutes
    otpStore.set(normalizedPhone, { otp, expires });

    await twilioClient.messages.create({
      body: `Your OTP for login is ${otp}. It expires in 5 minutes.`,
      from: TWILIO_PHONE_NUMBER,
      to: normalizedPhone,
    });

    return res.json({
      success: true,
      message: "OTP sent to your phone number via SMS",
      userId: user.id,
    });
  } catch (err) {
    console.error("sendLoginOtp error:", {
      name: err.name,
      message: err.message,
      stack: err.stack,
      details: err.errors || err,
    });
    return res.status(500).json({
      success: false,
      error: "Failed to send login OTP",
      details: err.message,
    });
  }
};

exports.verifyLoginOtp = async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;
    if (!phoneNumber || !otp) {
      console.error("verifyLoginOtp: Missing required fields");
      return res.status(400).json({
        success: false,
        error: "phoneNumber and otp are required",
      });
    }
    const normalizedPhone = normalisePhone(phoneNumber);
    if (!normalizedPhone || !/^[0-9\+]{10,15}$/.test(normalizedPhone)) {
      console.error("verifyLoginOtp: Invalid phoneNumber:", phoneNumber);
      return res.status(400).json({ success: false, error: "Invalid phoneNumber format" });
    }

    const stored = otpStore.get(normalizedPhone);
    if (!stored || stored.expires < Date.now() || stored.otp !== otp) {
      console.error("verifyLoginOtp: Invalid or expired OTP");
      return res.status(401).json({
        success: false,
        error: "Invalid or expired OTP",
      });
    }
    otpStore.delete(normalizedPhone);

    const user = await User.findOne({ where: { phoneNumber: normalizedPhone } });
    if (!user) {
      console.error("verifyLoginOtp: User not found for phoneNumber:", normalizedPhone);
      return res.status(404).json({ success: false, error: "User not found" });
    }
    user.isPhoneVerified = true;
    await user.save();
    console.log("verifyLoginOtp: User updated:", user.id);

    const token = signToken(user);
    return res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
        profilePhoto: user.profilePhoto,
        isPhoneVerified: user.isPhoneVerified,
      },
    });
  } catch (err) {
    console.error("verifyLoginOtp error:", {
      name: err.name,
      message: err.message,
      stack: err.stack,
      details: err.errors || err,
    });
    return res.status(500).json({
      success: false,
      error: "Failed to verify login OTP",
      details: err.message,
    });
  }
};

exports.googleRegister = async (req, res) => {
  try {
    const { googleId, email, profilePhoto, googleToken } = req.body || {};
    if (!googleId || !email || !googleToken) {
      console.error("googleRegister: Missing required fields");
      return res.status(400).json({
        success: false,
        error: "googleId, email, and googleToken are required",
      });
    }
    const ticket = await googleClient.verifyIdToken({
      idToken: googleToken,
      audience: GOOGLE_CLIENT_ID || "",
    });
    const payload = ticket.getPayload();
    if (!payload || payload.sub !== googleId) {
      console.error("googleRegister: Invalid Google token");
      return res.status(401).json({ success: false, error: "Invalid Google token" });
    }
    let user = await User.findOne({ where: { googleId } });
    if (!user) user = await User.findOne({ where: { email } });
    if (!user) {
      user = await User.create({
        username: payload.name || email.split("@")[0],
        email,
        googleId,
        profilePhoto: profilePhoto || payload.picture || null,
        isPhoneVerified: false,
      });
      console.log("googleRegister: User created:", user.id);
    } else {
      if (!user.googleId) user.googleId = googleId;
      if (!user.profilePhoto) user.profilePhoto = profilePhoto || payload.picture || user.profilePhoto;
      await user.save();
      console.log("googleRegister: User updated:", user.id);
    }
    const token = signToken(user);
    return res.json({
      success: true,
      message: "Google login/register successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
        profilePhoto: user.profilePhoto,
        isPhoneVerified: user.isPhoneVerified,
      },
    });
  } catch (err) {
    console.error("googleRegister error:", {
      name: err.name,
      message: err.message,
      stack: err.stack,
      details: err.errors || err,
    });
    return res.status(500).json({
      success: false,
      error: "Google register failed",
      details: err.message,
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ["googleId"] } });
    return res.json({ success: true, users });
  } catch (err) {
    console.error("getAllUsers error:", {
      name: err.name,
      message: err.message,
      stack: err.stack,
      details: err.errors || err,
    });
    return res.status(500).json({
      success: false,
      error: "Failed to fetch users",
      details: err.message,
    });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ["googleId"] },
    });
    if (!user) {
      console.error("getUserById: User not found for id:", req.params.id);
      return res.status(404).json({ success: false, error: "User not found" });
    }
    return res.json({ success: true, user });
  } catch (err) {
    console.error("getUserById error:", {
      name: err.name,
      message: err.message,
      stack: err.stack,
      details: err.errors || err,
    });
    return res.status(500).json({
      success: false,
      error: "Failed to fetch user",
      details: err.message,
    });
  }
};