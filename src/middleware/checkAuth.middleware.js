const { connectDb } = require("../config/db.config")

const checkAuth = (req, res, next) => {
    const token = req?.headers?.authorization?.split(' ')[1];
    return connectDb.table('users')
        .where('remember_token', '=', token)
        .first('*')
        .then((out) => {
            if (out) {
                next()
            } else {
                throw new Error
            }
        }).catch(() => {
            res.status(401).json({
                status: false,
                massage: "Unauthenticated",
            })
        })
}

const checkRolePenjual = (req, res, next) => {
    const token = req?.headers?.authorization?.split(' ')[1];
    return connectDb.table('users')
        .where('remember_token', '=', token)
        .first('*')
        .then((out) => {
            if (out?.role === "penjual" || out?.role === "admin") {
                next()
            } else {
                throw new Error
            }
        }).catch(() => {
            res.status(401).json({
                status: false,
                massage: "Unauthenticated",
            })
        })
}
const checkRoleAdmin = (req, res, next) => {
    const token = req?.headers?.authorization?.split(' ')[1];
    return connectDb.table('users')
        .where('remember_token', '=', token)
        .first('*')
        .then((out) => {
            if (out?.role === "admin") {
                next()
            } else {
                throw new Error
            }
        }).catch(() => {
            res.status(401).json({
                status: false,
                massage: "Unauthenticated",
            })
        })
}

module.exports = { checkAuth, checkRoleAdmin, checkRolePenjual }