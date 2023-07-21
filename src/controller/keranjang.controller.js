const { connectDb } = require("../config/db.config");
const { getUserByToken } = require("./auth.controller");

const getKeranjangByUser = async (req, res) => {
    const user = await getUserByToken(req?.headers?.authorization?.split(' ')[1])
    return await connectDb('keranjang')
        .leftJoin('produk', 'produk.id', '=', 'keranjang.produk_id')
        .where('user_id', user?.id)
        .select('produk.*', 'keranjang.jumlah')
        .then((out) => {
            res.json({
                status: true,
                massage: "Get data success",
                data: out,
            });
        }).catch((err) => {
            res.json({
                status: false,
                massage: "Get data failed",
                error: err
            })
        })
}

const storeKeranjang = async (req, res) => {
    const user = await getUserByToken(req?.headers?.authorization?.split(' ')[1])
    return await connectDb('keranjang')
        .insert({
            user_id: user?.id,
            produk_id: req?.body?.produk_id,
            jumlah: req?.body?.produk_id,
        }).then((out) => {
            if (out) {
                res.json({
                    status: true,
                    massage: "Store data success",
                    data: {
                        produk_id: req?.body?.produk_id,
                        jumlah: req?.body?.produk_id,
                    },
                });
            } else { throw new Error }
        }).catch((err) => {
            res.json({
                status: false,
                massage: "Get data failed",
                error: err
            })
        })
}

module.exports = {
    getKeranjangByUser,
    storeKeranjang
}