//Mongoose https://mongoosejs.com/
const mongoose = require('mongoose'); //mongoose
//unique val https://www.npmjs.com/package/mongoose-unique-validator
const uniqueValidator = require('mongoose-unique-validator');

/**
 *  hand (fighting system, jumping, responsiveness)
    eye (discovery, art, interface)
    ear (soundtrack, voices)
    brain (strategy, building, level design)
    speech (plot, dialogues, roleplay)
    feelings (game as pastime, replayability)
 */

//https://mongoosejs.com/docs/guide.html#definition
const gameSchema = new mongoose.Schema({

    title: { type: String, required: [true, 'required'], unique: true},
    year: { type: Number, required: [true, 'required']},
    developer: { type: String, required: [true, 'required']},
    publisher: { type: String, required: [true, 'required']},
    link: { type: String, required: [true, 'required'], unique: true},
    hand: { type: Number, required: [true, 'required'], min: 0, max: 9 },
    eye: { type: Number, required: [true, 'required'], min: 0, max: 9 },
    ear: { type: Number, required: [true, 'required'], min: 0, max: 9 },
    brain: { type: Number, required: [true, 'required'], min: 0, max: 9 },
    speech: { type: Number, required: [true, 'required'], min: 0, max: 9 },
    feelings: { type: Number, required: [true, 'required'], min: 0, max: 9 }
}, {
    timestamps: true
})

//handle unique error
gameSchema.plugin(uniqueValidator, { message: 'already reviewed'});

/**
When you call mongoose.model() on a schema, Mongoose compiles a model for you.
const schema = new mongoose.Schema({ name: 'string', size: 'string' });
const Tank = mongoose.model('Tank', schema);
The first argument is the singular name of the collection your model is for. Mongoose automatically looks for the plural, 
lowercased version of your model name. 
Thus, for the example above, the model Tank is for the tanks collection in the database.
 */
const Game = mongoose.model('Game', gameSchema)

module.exports = Game