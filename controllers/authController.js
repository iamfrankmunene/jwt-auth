const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv').config()

//handle errors
const handleErrors = (err) => {
    console.log("Error message",err.message,"Error code",err.code)
    let errors = { email: '', password: '' }

    // incorrect email
    if (err.message === 'Incorrect email') {
        errors.email = 'User not found'
    }

    // incorrect password
    if (err.message === 'Incorrect password') {
        errors.password = 'Incorrect credentials'
    }

    //duplicate error code
    if (err.code === 11000){
        errors.email = "Email is already registered"
        return errors
    }
    
    //validation errors
if (err.message.includes('user validation failed')) {
    Object.values(err.errors).forEach(({properties}) => {
        errors[properties.path] = properties.message
    })
}

return errors
}

const maxAge = 3 * 24 * 60 * 60
//jwt token
const createToken = (id) => {
    return jwt.sign({ id }, process.env.SECRET, {
        expiresIn: maxAge
    })
}


module.exports.signup_get = (req, res) => {
    res.render('signup')
}

module.exports.login_get = (req, res) => {
    res.render('login')
}

module.exports.signup_post = async (req, res) => {
    const { email, password } = req.body
    try {
        const user = new User ({ email, password})
        await user.save()
        const token = createToken(user._id)
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
        res.status(201).json(user)
    }
    catch(err){
        const errors = handleErrors(err)
        console.log('error',err)
        res.status(400).json({ errors })
    }
}

module.exports.login_post = async (req, res) => {
    const { email, password } = req.body

    try{
        const user = await User.login(email, password)
        const token = createToken(user._id)
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
        res.status(200).json({ user })
    }
    catch (err){
        const errors = handleErrors(err)
        res.status(400).json({ errors })
    }
}

module.exports.logout_get = (req, res) =>  {
    res.cookie('jwt', '', { maxAge: 1 })
    res.redirect('/')
}