const moment = require("moment")
const { connectDb } = require("../config/db.config")
const bcrypt = require('bcrypt')
require('dotenv').config()

const authLogin = async (req, res) => {
    return await connectDb.table('users')
        .where('nisn', req?.body?.nisn)
        .first('*').then(async (out) => {
            if (bcrypt.compareSync(req?.body?.password, out?.password)) {
                const randomToken = require('random-token').create('abcdefghijklmnopqrstuvwxzyABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')
                const token = randomToken(62)

                return await connectDb.table('users')
                    .where('id', out?.id)
                    .update({
                        remember_token: token,
                        login_terakhir: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
                    }).then(() => {
                        out['remember_token'] = token
                        res.json({
                            status: true,
                            massage: "Login success",
                            data: out,
                        })
                    })
            } else {
                throw new Error()
            }
        }).catch((err) => {
            res.json({
                status: false,
                massage: "Username / password incorrect",
                error: err
            })
        })
}
const authRegister = async (req, res) => {
    const randomToken = require('random-token').create('abcdefghijklmnopqrstuvwxzyABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')
    const token = randomToken(62)
    const data = {
        foto_profile: `${process.env.SERVER_HOST}/uploads/foto_profile/${req?.file?.filename}`,
        nama: req?.body?.nama,
        nisn: req?.body?.nisn,
        password: bcrypt.hashSync(req?.body?.password, bcrypt.genSaltSync(10)),
        remember_token: token,
        role: "user",
        created_at: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
        updated_at: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
        is_banned: 0,
        is_active: 0,
    }
    return await connectDb.table('users')
        .insert(data).then(() => {
            res.json({
                status: true,
                massage: "Register success",
                data: data
            })
        }).catch((err) => {
            res.json({
                status: false,
                massage: "Register failed",
                error: err
            })
        })
}
const authRefreshToken = async (req, res) => {
    const token = req?.headers?.authorization?.split(' ')[1];
    const randomToken = require('random-token').create('abcdefghijklmnopqrstuvwxzyABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')
    const newToken = randomToken(62)
    return await connectDb.table('users')
        .where('remember_token', token)
        .update({
            remember_token: newToken
        }).then(() => {
            res.json({
                status: true,
                massage: "Refresh token success",
                token: newToken
            })
        }).catch((err) => {
            res.json({
                status: false,
                massage: "Refresh token failed",
                error: err
            })
        })
}
const authLogout = async (req, res) => {

    const token = req?.headers?.authorization?.split(' ')[1];
    return await connectDb.table('users')
        .where('remember_token', token)
        .first('*')
        .then(async (out) => {
            if (out) {
                return await connectDb.table('users')
                    .where('id', out?.id)
                    .first('*')
                    .update({
                        remember_token: null
                    }).then(() => {
                        res.json({
                            status: true,
                            massage: "Logout success",
                        })
                    }).catch((err) => {
                        res.json({
                            status: false,
                            massage: "Logout failed",
                            error: err
                        })
                    })
            } else {
                throw new Error()
            }
        }).catch((err) => {
            res.json({
                status: false,
                massage: "Unauthenticated",
                error: err
            })
        })
}

const getUserByToken = async (token) => {
    return await connectDb('users')
        .where('remember_token', token)
        .first('*')
        .then((data) => {
            return data
        }).catch(() => {
            return null
        })
}

module.exports = {
    authLogin,
    authRegister,
    authRefreshToken,
    authLogout,
    getUserByToken
}