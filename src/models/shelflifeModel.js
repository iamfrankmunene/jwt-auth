const mongoose = require('mongoose')

const { ObjectId } = mongoose.Schema.Types; // Import ObjectId

const shelflifeModel = new mongoose.Schema({
  user_id: {
    type: ObjectId, // Use ObjectId type
    ref: 'User', // Reference to the User model
    required: true,
  },
     item: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
  },
  completed: {
    type: Boolean
  }
})
  
  module.exports = mongoose.model('ShelflifeInputs', shelflifeModel)