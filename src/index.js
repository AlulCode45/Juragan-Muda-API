const express = require('express')
const app = express()

//route
const authRoute = require('./routes/auth.route')
const { checkConnectionDb } = require('./config/db.config')
const bodyParser = require('body-parser')

require('dotenv').config()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static('public'))

app.use(checkConnectionDb)
app.use('/auth', authRoute)



app.listen(process.env.SERVER_PORT, () => {
    console.log(`Running on port ${process.env.SERVER_PORT} => http://localhost:${process.env.SERVER_PORT}`)
})