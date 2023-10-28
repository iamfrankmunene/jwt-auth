const express = require('express')
const { registerUser, loginUser, logoutUser } = require('../controllers/authController')

const router = express.Router()

// Route to handle user registration
router.post('/register', registerUser)

// Route to handle user login
router.post('/login', loginUser)

// Route to handle user logout
router.get('/logout', logoutUser)

module.exports = router
