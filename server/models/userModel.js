const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')
const validator = require('validator')

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})

// creating static method called signup which takes care of hashing the passwords. For this we have to use our schema.statics.staticMethodName
// for some reason arrow functions dont work with this keyword used here.
userSchema.statics.signup = async function ({email, password}) {

    // validate
    if (!email || !password) {
        throw Error("All fields are required")
    }
    if (!validator.isEmail(email)) {
        throw Error("Email is not valid")
    }
    if (!validator.isStrongPassword(password)) {
        throw Error("Password is not strong enough")
    }

    // first let's check if email already exists in our collection. Although we used unique: true, this can be an additional safety layer.
    // this refers to this model which is linked to userSchema, User is not used because we are naming and exporting it at the bottom of this file
    const exists = await this.findOne({email}) // retuns user if present
    if (exists) {
        throw Error("Email already exists");
    }
    // hash the pw
    // salt technique to attach random string to the pw at the end, if 2 people has same password, salt will result in differnt hashing of both pws which helps us to prevent hacker to figure out the one pw using other pw, so identical pws will be different in the end
    const salt = await bcrypt.genSalt(10)  // default value is 10, higher the value, longer it takes to hash and longer it takes to signup users
    const hash = await bcrypt.hash(password, salt)  // this attaches salt to pw first and hashes next

    const user = await this.create({email, password: hash})

    return user
}


userSchema.statics.login = async function ({email, password}) {
    // validate
    if (!email || !password) {
        throw Error("All fields are required")
    }

    const user = await this.findOne({email}) // retuns user if present

    // if we cannot find user based on the email received
    if (!user) {
        throw Error("Incorrect email entered");
    }

    const isMatch = await bcrypt.compare(password, user.password)   // compare is an async function, so await 
    // if password doesn't match
    if (!isMatch) {
        throw Error("Incorrect password entered")
    }
    return user
}

// mongoose.model('User', userSchema) => mongoose.model is a method provided by Mongoose to create a model based on a schema(userSchema in this case), 'User' will be the name of the model, note that model and collection are different, collection in mongodb refers to a collection of mongoDB documents, model in mongoose refers to a Mongoose abstraction that provides an interface for interacting with a specific collection of documents., if a model name is 'User', a collection named 'users' is created by default.
module.exports = mongoose.model('User', userSchema)