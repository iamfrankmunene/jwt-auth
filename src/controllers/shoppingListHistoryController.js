const ShoppingListModel = require('../models/shoppingListModel');

const getDeleteHistory = async (req, res) => {
  try {
    const { user_id } = req.params; // Get user_id from URL
    const deletedItems = await ShoppingListModel.find({ user_id, completed: true }); // Filter by user_id and completed status
    res.status(200).json(deletedItems);
  } catch (error) {
    res.status(500).send('Error fetching delete history', error);
  }
}

const deleteItemFromHistory = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { user_id } = req.params; // Get user_id from URL
    const item = await ShoppingListModel.findOneAndDelete({ _id: itemId, user_id, completed: true }); // Ensure that the item belongs to the user and is completed
    if (!item) {
      return res.status(404).send('Shopping list item not found in the delete history');
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(500).send('Error deleting item from delete history', error);
  }
}

module.exports = {
  getDeleteHistory,
  deleteItemFromHistory
};
