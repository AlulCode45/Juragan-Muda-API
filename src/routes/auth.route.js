const express = require('express')
const { authLogin, authRegister, authRefreshToken, authLogout } = require('../controller/auth.controller');
const multer = require('multer');
const path = require('path');
const { checkAuth } = require('../middleware/checkAuth.middleware');

const authRoute = express.Router()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads/foto_profile/');
    },
    filename: function (req, file, cb) {
        const fileExtension = path.extname(file.originalname);
        const randomName = require('random-token').create('abcdefghijklmnopqrstuvwxzyABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')
        const name = randomName(30)

        cb(null, `${Date.now()}-${name}${fileExtension}`);
    }
});

const upload = multer({ storage: storage });

authRoute.post('/login', authLogin)
authRoute.post('/register', upload.single('foto_profile'), authRegister)

authRoute.use(checkAuth)
authRoute.post('/refresh-token', authRefreshToken)
authRoute.post('/logout', authLogout)

module.exports = authRoute