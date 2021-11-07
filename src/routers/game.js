const Game = require('../models/game')
const express = require('express')
const auth = require('../middleware/auth')
const router = new express.Router()
const { body, validationResult, param } = require('express-validator')

/**
 * 
 */
router.post('/create-review',

    //validation and sanitization
    body('title').not().isEmpty().trim().escape(),
    body('year').isInt({min:1980, max:2080}).not().isEmpty().trim().escape(),
    body('developer').not().isEmpty().trim().escape(),
    body('publisher').not().isEmpty().trim().escape(),
    body('link').isURL().not().isEmpty().trim(),
    body('hand').isInt({min:0, max:9}).not().isEmpty(),
    body('eye').isInt({min:0, max:9}).not().isEmpty(),
    body('ear').isInt({min:0, max:9}).not().isEmpty(),
    body('brain').isInt({min:0, max:9}).not().isEmpty(),
    body('speech').isInt({min:0, max:9}).not().isEmpty(),
    body('feelings').isInt({min:0, max:9}).not().isEmpty(),

    auth,

    async (req, res) => {   
        const errors = validationResult(req)
        if (!errors.isEmpty()) { return res.status(400).json({ errors: errors.array() }) }
        //from auth middleware
        if(req.role != 'publisher' && req.role != 'admin') { return res.status(401).json({ errors: 'Unauthorized' }) }
        
        const game = new Game(req.body)
        
        try { 
            
            await game.save()  
            res.status(201).send({ game }) 
        }
        catch (e) { res.status(400).send(e) }  
    }
)

router.get('/games/:id',

    param('id').trim().isMongoId(),

    async (req, res) => {

        const errors = validationResult(req)

        if (!errors.isEmpty())  { return res.status(400).json({ errors: errors.array() }) } 
        else {
            try {
                const game = await Game.findOne({ _id: req.params.id })
                if (!game) { return res.status(404).send({error: 'No game'}) }
                
                res.send(game)
        
            } catch (e) { res.status(500).send() }
        }
    }
)

module.exports = router