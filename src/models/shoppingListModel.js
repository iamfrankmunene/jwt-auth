const mongoose = require('mongoose')

const { ObjectId } = mongoose.Schema.Types // Import ObjectId

const shoppingListItemModel = new mongoose.Schema({
  user_id: {
    type: ObjectId, 
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true
},
  completed: {
    type: Boolean,
    default: false
},
  crossedOutDate:{
     type: Date
},
})

const ShoppingListModel = mongoose.model('ShoppingListItem', shoppingListItemModel)

module.exports = ShoppingListModel
