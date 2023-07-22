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
    const data = {
        user_id: user?.id,
        nama_toko: req?.body?.nama_toko,
        deskripsi_toko: req?.body?.deskripsi_toko,
        logo: req?.body?.logo,
        alamat: req?.body?.alamat,
        dusun: req?.body?.dusun,
        desa: req?.body?.desa,
        kecamatan: req?.body?.kecamatan,
        kabupaten_kota: req?.body?.kabupaten_kota,
        provinsi: req?.body?.provinsi,
        kode_pos: req?.body?.kode_pos,
        negara: req?.body?.negara,
        rt: req?.body?.rt,
        rw: req?.body?.rw,
        created_at: req?.body?.created_at || new Date().toISOString(),
        login_terakhir: req?.body?.login_terakhir || new Date().toISOString(),
        jam_operasi: req?.body?.jam_operasi
    }

    if (user?.role === "penjual") {
        await connectDb('toko')
            .where('user_id', user?.id)
            .then(async (toko) => {
                if (toko.length > 0) {
                    res.json({
                        status: false,
                        message: 'Anda sudah memiliki toko',
                    })
                } else {
                    connectDb('toko')
                        .insert(data)
                        .then(() => {
                            res.json({
                                status: true,
                                message: '',
                                data: data
                            })
                        }).catch((err) => {
                            res.json({
                                status: false,
                                message: 'Insert data failed',
                                error: err
                            })
                        })
                }
            })
    } else {
        res.status(401).json({
            status: false,
            message: 'Unauthorized',
        })
    }
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