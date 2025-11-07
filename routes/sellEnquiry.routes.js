const express = require("express");
const router = express.Router();
const controller = require("../controllers/sellEnquiryController");
const upload = require("../utils/multer");

// Use correct multer middleware
const uploadFields = upload.fields([
  { name: "images", maxCount: 5 },
  { name: "document", maxCount: 1 },
  { name: "verificationDocs", maxCount: 3 } // Added this field
]);

router.post("/", uploadFields, controller.createEnquiry);
router.get("/", controller.getAllEnquiries);
router.get("/:id", controller.getEnquiryById);
router.put("/:id", uploadFields, controller.updateEnquiry);
router.delete("/:id", controller.deleteEnquiry);

module.exports = router;