// controllers/contactController.js
// const Contact = require("../models/contact");
const { Contact } = require("../models");


exports.submitContactForm = async (req, res) => {
  try {
    const { name, email, phone, subject, otherSubject, comments } = req.body;

    if (!name || !email || !comments) {
      return res.status(400).json({ message: "Name, Email, and Comments are required." });
    }

    await Contact.create({ name, email, phone, subject, otherSubject, comments });

    res.status(200).json({ message: "Contact form submitted successfully." });
  } catch (error) {
    console.error("Contact Form Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
exports.updateContact = async (req, res) => {
  try {
    const { name, email, phone, subject, otherSubject, comments } = req.body;

    const contact = await Contact.findByPk(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    // Update fields
    await contact.update({ name, email, phone, subject, otherSubject, comments });

    res.status(200).json({ message: "Contact updated successfully", contact });
  } catch (error) {
    res.status(500).json({ message: "Error updating contact", error: error.message });
  }
};


exports.getAllContacts = async (req, res) => {
  try {
 const contacts = await Contact.findAll({ order: [["createdAt", "DESC"]] });
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching contacts", error: error.message });
  }
};

exports.getContactById = async (req, res) => {
  try {
    const contact = await Contact.findByPk(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res.status(200).json(contact);
  } catch (error) {
    res.status(500).json({ message: "Error fetching contact", error: error.message });
  }
};

exports.deleteContact = async (req, res) => {
  try {
    const result = await Contact.destroy({ where: { id: req.params.id } });
    if (result === 0) {
      return res.status(404).json({ message: "Contact not found or already deleted" });
    }
    res.status(200).json({ message: "Contact deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting contact", error: error.message });
  }
};
