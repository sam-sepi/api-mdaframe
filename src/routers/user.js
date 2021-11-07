const User = require('../models/user')
const Role = require('../models/role')
const express = require('express')
const router = new express.Router()
const { body, check, validationResult } = require('express-validator')
const auth = require('../middleware/auth')

/**
 * SIGNIN
 */
router.post('/signin',

    body('username').not().isEmpty().trim().isAlphanumeric().isLength({ min: 3, max: 20 }),
    body('email').trim().isEmail(),
    check('password', 'Password should be combination of one uppercase , one lower case, one special char, one digit and min 8 , max 20 char long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/, "i")
        .isLength({max: 20}),
    async (req, res) => {

        if(req.body.password == req.body.confirm)
        {
            const errors = validationResult(req);

            if (!errors.isEmpty()) { return res.status(400).json({ errors: errors.array() }) }
            else 
            {
                const user = new User(req.body)
                try { 
                    await user.save(); 
                    //role
                    const role = new Role({username: user.username, userRef: user._id, role: 'player'})
                    await role.save(); 
                    //res
                    res.status(201).send({ user }) 
                } 
                catch (e) { res.status(400).send(e) }    
            }
        } else { res.status(400).send({ errors: 'Confirm password error' }) }
    }
)

/**
 * LOGIN
 */
router.post('/login', 

    body('username').not().isEmpty().trim().escape(),
    body('password').not().isEmpty(),

    async(req, res) => {
        try {
            const user = await User.findByCredentials(req.body.username, req.body.password)
            const token = await user.generateAuthToken()
            res.send({ username: user.username, token })
        } 
        catch(e) {
            res.status(400).send({error: e})
        }
    }
)

/**
 * LOGOUT
 */
router.post('/logout', auth, 
    
    async (req, res) => {

        try {
            req.user.tokens = []
            await req.user.save()
            res.send({message: 'Logout'})
        } catch (e) {
            res.status(500).send()
    }
})

/**
 * UPDATE
 */
router.patch('/users/me', 

    body('email').trim().isEmail(),
    check('password', 'Password should be combination of one uppercase , one lower case, one special char, one digit and min 8 , max 20 char long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/, "i")
        .isLength({max: 20}),
    
    auth, 

    async (req, res) => {

        const updates = Object.keys(req.body)
        const allowedUpdates = ['email', 'password']
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

        if (!isValidOperation) { return res.status(400).send({ error: 'Invalid updates!' }) }

        try {
            updates.forEach((update) => req.user[update] = req.body[update])
            await req.user.save()
            res.send(req.user)
        } catch (e) {
            res.status(400).send(e)
        }
    }
)

module.exports = router