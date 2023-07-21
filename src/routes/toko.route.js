const express = require('express')
const { getAllToko, getTokoById, storeToko, deleteToko, updateToko } = require('../controller/toko.controller')
const { checkRolePenjual } = require('../middleware/checkAuth.middleware')
const tokoRoute = express.Router()

tokoRoute.get('/', getAllToko)
tokoRoute.get('/:id', getTokoById)


tokoRoute.use(checkRolePenjual)
tokoRoute.post('/', storeToko)
tokoRoute.delete('/:id', deleteToko)
tokoRoute.post('/update', updateToko)

module.exports = tokoRoute