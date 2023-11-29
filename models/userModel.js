const mongoose = require('mongoose')
const { isEmail } = require('validator')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: [true, 'Please enter your email'],
        unique: true,
        lowercase: true,
        validate:[isEmail,'Please enter a valied email']
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength:[4, 'Minimum characters of 4 required']
    }
})

//fire a function before doc is saved to db
userSchema.pre('save', async function (next){
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)
    next()
})


//Static method to login users
userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email })
    if (user) {
       const auth = await bcrypt.compare(password, user.password)
       if (auth) {
        return user
       }
       throw Error('Incorrect password')
    } 
    throw Error('Incorrect email')
}

const User = mongoose.model('user',userSchema)

module.exports = User