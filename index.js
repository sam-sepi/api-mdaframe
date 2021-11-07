/**
 * Packages
 * 
 * express
 * express-rate-limit
 * rate-limit-mongo
 * helmet
 * mongoose
 * unique-validator
 */

//EXPRESS INIT.
const express = require('express')
const app = express()

//HELMET - Helmet helps you secure your Express apps by setting various HTTP headers.
var helmet = require('helmet');
app.use(helmet())

//DB CONN
require('./src/db/db-connect')

//PORT
const PORT = 3008

//JSON 
app.use(express.json({ limit: '10kb' })); // Body limit is 10 -> DoS prevent

// Limit request. Apply to all requests -> limit 100 request 10 min
const limiter = require('./src/middleware/limiter');
app.use(limiter)

//ROUTING
const gameRouter = require('./src/routers/game')
app.use(gameRouter)

const userRouter = require('./src/routers/user')
app.use(userRouter)

/***
 * SERVER
 */

//SERVER LISTEN
app.listen(PORT, () => console.log('Server ready'))