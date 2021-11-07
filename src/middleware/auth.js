const jwt = require('jsonwebtoken')
const User = require('../models/user')
const Role = require('../models/role')

const auth = async (req, res, next) => {

    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, 'mysecretokenbl@')
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })
        const role = await Role.findOne({ username: user.username })

        if (!user) { throw new Error() }
        
        req.token = token
        req.user = user
        req.role = role.role

        next()

    } catch (e) { res.status(401).send({ error: 'Please authenticate.' }) }
}

module.exports = auth