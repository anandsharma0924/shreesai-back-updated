const db = require('../models');
const MobileNumber = db.MobileNumber || require('../models/number')(require('../models').sequelize, require('../models').Sequelize.DataTypes);
exports.addNumber = async (req, res) => {
  const { number } = req.body;
  if (!number || typeof number !== 'string' || !/^[0-9]{10}$/.test(number.trim())) {
    return res.status(400).json({ error: 'Invalid or missing 10-digit phone number' });
  }
  try {
    const newNumber = await MobileNumber.create({ number: number.trim() });
    res.status(201).json({ message: 'Number saved', data: newNumber });
  } catch (error) {
    console.error('Error saving number:', error);
    res.status(500).json({ error: 'Error saving number', details: error.message });
  }
};

exports.getNumbers = async (req, res) => {
  try {
    if (typeof MobileNumber.findAll !== 'function') {
      throw new Error('MobileNumber.findAll is not a function');
    }
    const numbers = await MobileNumber.findAll({ where: { is_delete: false } });
    res.status(200).json(numbers);
  } catch (error) {
    console.error('Error fetching numbers:', error);
    res.status(500).json({ error: 'Error fetching numbers', details: error.message });
  }
};

exports.deleteSingleNumber = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({ error: 'Invalid ID' });
  }

  try {
    const deleted = await MobileNumber.destroy({ where: { id } });
    if (deleted) {
      res.status(200).json({ message: 'Number deleted successfully' });
    } else {
      res.status(404).json({ error: 'Number not found' });
    }
  } catch (error) {
    console.error('Error deleting number:', error);
    res.status(500).json({ error: 'Error deleting number', details: error.message });
  }
};

exports.deleteAllNumbers = async (req, res) => {
  try {
    const deleted = await MobileNumber.destroy({ where: {} });
    res.status(200).json({ message: `${deleted} numbers deleted successfully` });
  } catch (error) {
    console.error('Error deleting all numbers:', error);
    res.status(500).json({ error: 'Error deleting numbers', details: error.message });
  }
};

// Test endpoint to add a sample number
exports.addTestNumber = async (req, res) => {
  try {
    const testNumber = '1234567890';
    const existing = await MobileNumber.findOne({ where: { number: testNumber, is_delete: false } });
    if (!existing) {
      await MobileNumber.create({ number: testNumber });
    }
    res.status(201).json({ message: 'Test number added', number: testNumber });
  } catch (error) {
    console.error('Error adding test number:', error);
    res.status(500).json({ error: 'Error adding test number', details: error.message });
  }
};