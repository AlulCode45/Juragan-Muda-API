const express = require('express')
const { getRatingById, storeRating } = require('../controller/rating.controller')
const { checkAuth } = require('../middleware/checkAuth.middleware')
const ratingRoute = express.Router()

ratingRoute.get('/:id', getRatingById)

ratingRoute.use(checkAuth)
ratingRoute.post('/', storeRating)

module.exports = ratingRoute