//Mongoose https://mongoosejs.com/
const mongoose = require('mongoose'); //mongoose

//https://mongoosejs.com/docs/guide.html#definition
const roleSchema = new mongoose.Schema({

    username: {type: String, required: [true, 'required'], unique: true},
    userRef: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
    role: { type: String, 
    enum: {
        values: ['player', 'publisher', 'admin'],
        message: '{VALUE} is not supported'
    }}

}, {
    timestamps: true
})

const Role = mongoose.model('Role', roleSchema)

module.exports = Role