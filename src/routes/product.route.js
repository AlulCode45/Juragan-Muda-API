const express = require('express')
const { getAllProduct, getProductById, storeProduct, deleteProduct, storeRating } = require("../controller/product.controller");
const multer = require('multer');
const path = require('path');
const { checkRolePenjual } = require('../middleware/checkAuth.middleware');
const productRoute = express.Router()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads/foto_produk/');
    },
    filename: function (req, file, cb) {
        const fileExtension = path.extname(file.originalname);
        const randomName = require('random-token').create('abcdefghijklmnopqrstuvwxzyABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')
        const name = randomName(30)

        cb(null, `${Date.now()}-${name}${fileExtension}`);
    }
});

const upload = multer({ storage: storage });

productRoute.get('/', getAllProduct)
productRoute.get('/:id', getProductById)
productRoute.post('/rating', storeRating)

productRoute.use(checkRolePenjual)
productRoute.post('/', upload.array('foto_produk', 10), storeProduct)
productRoute.delete('/:id', deleteProduct)


// productRoute.post('/upload-foto-product/:id', upload.array('foto_produk', 10), uploadFotoProduct)

module.exports = productRoute