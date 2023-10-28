const ShoppingListModel = require('../models/shoppingListModel')
const { ObjectId } = require('mongodb')

const createItem = async (req, res) => {
  try {
    const { user_id } = req.params; // Get user_id from URL
    const { name } = req.body;
    const newItem = new ShoppingListModel({ user_id, name }); // Include user_id
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).send('Error creating shopping list item', error);
  }
}

const updateItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { user_id } = req.params; // Get user_id from URL
    const item = await ShoppingListModel.findById(itemId);
    if (!item) {
      return res.status(404).send('Shopping list item not found');
    }
    if (!new ObjectId(item.user_id).equals(new ObjectId(user_id))) {
      return res.status(403).send('Access denied'); // Ensure that the item belongs to the user
    }
    item.completed = true;
    item.crossedOutDate = new Date();
    await item.save();
    res.status(200).send(item);
  } catch (error) {
    res.status(500).json({'Error updating item': error})
  }
}

const deleteItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { user_id } = req.params; // Get user_id from URL
    const item = await ShoppingListModel.findById(itemId);
    if (!item) {
      return res.status(404).send('Shopping list item not found');
    }
    if (!new ObjectId(item.user_id).equals(new ObjectId(user_id))) {
      return res.status(403).send('Access denied'); // Ensure that the item belongs to the user
    }
    await ShoppingListModel.findByIdAndDelete(itemId);
    res.status(200).json(item);
  } catch (error) {
    res.status(500).send('Error deleting shopping list item', error);
  }
}

const getItems = async (req, res) => {
  try {
    const { user_id } = req.params; // Get user_id from URL
    const deletedItems = await ShoppingListModel.find({ user_id }); // Filter by user_id
    res.status(200).send(deletedItems);
  } catch (error) {
    res.status(500).send('Error fetching delete history', error);
  }
}

module.exports = {
  createItem,
  updateItem,
  getItems,
  deleteItem
};
