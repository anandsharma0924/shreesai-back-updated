const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contactController");

// ✅ Do NOT include /api/contact here — already prefixed in app.js
router.post("/", contactController.submitContactForm);
router.get("/", contactController.getAllContacts);
router.get("/:id", contactController.getContactById);
router.put("/:id", contactController.updateContact); // 🔥 Added PUT route
router.delete("/:id", contactController.deleteContact);

module.exports = router;
