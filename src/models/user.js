//Mongoose https://mongoosejs.com/
const mongoose = require('mongoose'); //mongoose
//bcrypt for pss https://www.npmjs.com/package/bcryptjs
const bcrypt = require('bcryptjs') //bcrypt
//token for auth https://www.npmjs.com/package/jsonwebtoken
const jwt = require('jsonwebtoken') //jsonwebtoken
//unique val https://www.npmjs.com/package/mongoose-unique-validator
const uniqueValidator = require('mongoose-unique-validator');

//https://mongoosejs.com/docs/guide.html#definition
const userSchema = new mongoose.Schema({
    username: { type: String, required: [true, 'required'], unique: true },
    email: { type: String, unique: true, required: [true, 'required'], lowercase: true },
    password: { type: String, required: [true, 'required'] },
    isBanned: { type: Boolean, default: false},
    tokens: [{ token: { type: String, required: true } }]
}, {
    timestamps: true
})

//Adds an instance method to documents constructed from Models compiled from this schema.
userSchema.methods.generateAuthToken = async function () {
    
    const user = this 
    //expires 24h
    const token = jwt.sign({ _id: user._id.toString() }, 'mysecretokenbl@', { expiresIn: '24h' })

    if(!token) { throw new Error('Error token') }

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

//unique handle error
userSchema.plugin(uniqueValidator, { message: 'Username or email taken'})

//Defines a pre hook for the model.
userSchema.pre('save', async function (next) {
    
    const user = this
    if (user.isModified('password')) { user.password = await bcrypt.hash(user.password, 8) }

    next()
})

//Adds static "class" methods to Models compiled from this schema.
userSchema.statics.findByCredentials = async(username, password) => {
    
    const user = await User.findOne({ username })

    if(!user) { throw new Error('Unable to login') }

    const isAuth = await bcrypt.compare(password, user.password)

    if(!isAuth) { throw new Error('Unable to login') }

    return user
}

/**
When you call mongoose.model() on a schema, Mongoose compiles a model for you.
const schema = new mongoose.Schema({ name: 'string', size: 'string' });
const Tank = mongoose.model('Tank', schema);
The first argument is the singular name of the collection your model is for. Mongoose automatically looks for the plural, 
lowercased version of your model name. 
Thus, for the example above, the model Tank is for the tanks collection in the database.
 */
const User = mongoose.model('User', userSchema)

module.exports = User