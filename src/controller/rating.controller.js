const { connectDb } = require("../config/db.config")
const { getUserByToken } = require("./auth.controller")

const getRatingById = async (req, res) => {
    return await connectDb('rating')
        .where('produk_id', req?.params?.id)
        .then((out) => {
            if (out) {
                let totalRating = 0
                out.forEach(item => {
                    totalRating += item?.rating
                })
                const rating_average = totalRating / out?.length
                let bulatSatuDesimal = Math.round(rating_average * 10) / 10;
                let stringSatuDesimal = bulatSatuDesimal.toFixed(1);

                res.json({
                    status: true,
                    massage: 'Get data success',
                    average_rating: stringSatuDesimal,
                    data: out,
                })
            }
        }).catch((err) => {
            res.json({
                status: false,
                massage: 'Get data failed',
                error: err,
            })
        })
}
const storeRating = async (req, res) => {
    const user = await getUserByToken(req?.headers?.authorization?.split(' ')[1])
    return await connectDb('rating')
        .where({
            user_id: user?.id,
            produk_id: req?.body?.produk_id
        })
        .then(async (out) => {
            if (out.length < 1) {
                return await connectDb('rating')
                    .insert({
                        produk_id: req?.body?.produk_id,
                        user_id: user?.id,
                        rating: req?.body?.rating
                    }).then(() => {
                        res.json({
                            status: true,
                            massage: 'Store data success',
                            data: {
                                produk_id: req?.body?.produk_id,
                                rating: req?.body?.rating
                            },
                        })
                    }).catch(() => { throw new Error })
            } else {
                res.json({
                    status: false,
                    massage: 'Sudah rating sebelumnya'
                })
            }
        }).catch((err) => {
            res.json({
                status: false,
                massage: 'Store data failed',
                error: err,
            })
        })
}

module.exports = {
    getRatingById,
    storeRating
}