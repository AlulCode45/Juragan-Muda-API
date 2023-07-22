const express = require('express')
const app = express()

//route
const authRoute = require('./routes/auth.route')
const productRoute = require('./routes/product.route')
const tokoRoute = require('./routes/toko.route')
const keranjangRoute = require('./routes/keranjang.route')
//requirements
const { checkConnectionDb } = require('./config/db.config')
const bodyParser = require('body-parser')
const cors = require('cors')

require('dotenv').config()
app.use(cors())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static('public'))

app.use(checkConnectionDb)
app.use('/auth', authRoute)

app.use('/product', productRoute)

app.use('/toko', tokoRoute)

app.use('/keranjang', keranjangRoute)

app.listen(process.env.SERVER_PORT, () => {
    console.log(`Running on port ${process.env.SERVER_PORT} => http://localhost:${process.env.SERVER_PORT}`)
})