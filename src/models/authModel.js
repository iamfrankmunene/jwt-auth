const mongoose = require('mongoose')

const authSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
})

const AuthModel = mongoose.model('Users', authSchema)

module.exports = AuthModel;
