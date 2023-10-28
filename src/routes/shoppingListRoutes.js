const express = require('express')
const {
  createItem,
  updateItem,
  deleteItem,
  getItems
} = require('../controllers/shoppingListController')

const router = express.Router()

// Create a new shopping list item
router.post('/:user_id', createItem)

// Get all shopping list items
router.get('/:user_id', getItems)

// Update a shopping list item
router.put('/:user_id/:itemId', updateItem)

// Delete a shopping list item
router.delete('/:user_id/:itemId', deleteItem)


module.exports = router
