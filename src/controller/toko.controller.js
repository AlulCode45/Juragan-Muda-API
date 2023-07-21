const { connectDb } = require("../config/db.config")
const { getUserByToken } = require("./auth.controller")

const getAllToko = async (req, res) => {
    return await connectDb('toko')
        .then((out) => {
            res.json({
                status: true,
                massage: 'Get data success',
                data: out
            })
        }).catch((err) => {
            res.json({
                status: false,
                massage: 'Get data failed',
                error: err
            })
        })
}
const getTokoById = async (req, res) => {
    return await connectDb('toko')
        .where('id', req?.params?.id)
        .first('*')
        .then((out) => {
            res.json({
                status: true,
                massage: 'Get data success',
                data: out
            })
        }).catch((err) => {
            res.json({
                status: false,
                massage: 'Get data failed',
                error: err
            })
        })

}
const storeToko = async (req, res) => {
    const user = await getUserByToken(req?.headers?.authorization?.split(' ')[1])

}
const deleteToko = async (req, res) => {
    const user = await getUserByToken(req?.headers?.authorization?.split(' ')[1])
    return await connectDb('toko')
        .where({
            'toko.id': req?.params?.id,
            'toko.user_id': user?.id
        })
        .del()
        .then((out) => {
            if (out) {
                res.json({
                    status: true,
                    massage: 'Delete data success',
                })
            } else {
                throw new Error
            }
        }).catch((err) => {
            res.json({
                status: false,
                massage: 'Delete data failed',
                error: err
            })
        })

}
const updateToko = async (req, res) => {

}

module.exports = {
    getAllToko,
    getTokoById,
    storeToko,
    deleteToko,
    updateToko
}