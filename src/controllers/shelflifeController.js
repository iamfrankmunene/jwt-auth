const shelflife = require('../models/shelflifeModel')
const { ObjectId } = require('mongodb')

const newShelflifeInput = async (req, res) => {
  try {
    const { user_id, item, date, time, completed } = req.body;

    const newShelflifeInput = new shelflife({
      user_id,
      item,
      date,
      time,
      completed: completed || false,
    });

    await newShelflifeInput.save();
    res.status(200).json({ message: 'Shelflife input saved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error saving Shelflife input', message: error.message })
  }
};

const getAllShelflifeInputs = async (req, res) => {
  try {
    const { user_id } = req.params;
    const shelflifeInputs = await shelflife.find({ user_id });
    res.status(200).json(shelflifeInputs);
  } catch (error) {
    res.status(500).json({ error: 'Error getting Shelflife inputs', message: error.message });
  }
};

const updateShelflifeInput = async (req, res) => {
  try {
    const { item, date, time, completed } = req.body;
    const { id, user_id } = req.params;

    const existingShelflifeInput = await shelflife.findById(id);

    if (!existingShelflifeInput) {
      return res.status(404).json({ error: 'Shelflife input not found' });
    }

    // Check that the existing input belongs to the same user
    if (!new ObjectId(existingShelflifeInput.user_id).equals(new ObjectId(user_id))) {
      return res.status(403).json({ error: 'Access denied' });
    }

    existingShelflifeInput.item = item;
    existingShelflifeInput.date = date;
    existingShelflifeInput.time = time;
    existingShelflifeInput.completed = completed || false;

    await existingShelflifeInput.save();

    res.status(200).json({ message: 'Shelflife input updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error updating Shelflife input', message: error.message })
  }
};

const deleteShelflifeInput = async (req, res) => {
  try {
    const { id } = req.params
    const { user_id } = req.params

    const existingShelflifeInput = await shelflife.findById(id);

    if (!existingShelflifeInput) {
      return res.status(404).json({ error: 'Shelflife input not found' });
    }

    // Check that the existing input belongs to the same user
    if (!new ObjectId(existingShelflifeInput.user_id).equals(new ObjectId(user_id))) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const deletedShelflifeInput = await shelflife.findByIdAndDelete(id);

    if (!deletedShelflifeInput) {
      return res.status(404).json({ error: 'Shelflife input not found' });
    }

    res.status(200).json({ message: 'Shelflife input deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting Shelflife input', message: error.message })
  }
};

module.exports = {
  newShelflifeInput,
  getAllShelflifeInputs,
  updateShelflifeInput,
  deleteShelflifeInput,
};
