const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv').config()
const AuthModel = require('../models/authModel')



const createToken = (id) => {
  return jwt.sign({id}, process.env.SECRET,{
    expiresIn: 7*24*60*60
  })
}

const registerUser = async (req, res) => {
  try {
    const { username, password } = req.body

    // Check if the user already exists
    const existingUser = await AuthModel.findOne({ username })
    if (existingUser) {
      return res.status(409).json({ message: 'Username taken' })
    }

    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create a new user in the database
    const newUser = new AuthModel({
      username,
      password: hashedPassword,
    })

    await newUser.save()

    //Grab the user_id
    const user_id = newUser._id

    // Create and send a JSON Web Token (JWT) to the client for further authentication
    const token = createToken (newUser._id)
    res.cookie('jwt', token, {httpOnly: true, maxAge: 7*24*60*60*1000})

    res.status(201).json({ user_id,message: 'User created successfully' })
  } catch (error) {
    res.status(500).json({ message: 'All fields required' })
  }
}

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body

    // Find the user in the database
    const user = await AuthModel.findOne({ username })
    if (!user) {
      return res.status(401).json({ message: 'Authentication failed' })
    }

    // Check if the password matches the hashed password stored in the database
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Incorrect credentials' })
    }

    // Grab the user_id
    const user_id = user._id

    // Create and send a JSON Web Token (JWT) to the client for further authentication
    const token = createToken (user_id)
    res.cookie('jwt', token, {httpOnly: true, maxAge: 7*24*60*60*1000})

    res.status(200).json({user_id, message: 'Authentication successful'})
  } catch (error) {
    res.status(500).json({ message: 'Error authenticating user', error })
  }
}


const logoutUser = async (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 })
  req.user = null
}

module.exports = { registerUser, loginUser, logoutUser }
