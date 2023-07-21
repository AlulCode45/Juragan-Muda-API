const express = require('express')
const { checkAuth } = require('../middleware/checkAuth.middleware')
const { getKeranjangByUser, storeKeranjang } = require('../controller/keranjang.controller')
const keranjangRoute = express.Router()

keranjangRoute.use(checkAuth)
keranjangRoute.get('/', getKeranjangByUser)
keranjangRoute.post('/', storeKeranjang)

module.exports = keranjangRoute