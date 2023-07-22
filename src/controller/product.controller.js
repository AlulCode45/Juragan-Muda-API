const { connectDb } = require("../config/db.config");
const { getUserByToken } = require("./auth.controller");
const getAllProduct = async (req, res) => {
    await connectDb('produk')
        .leftJoin('foto_produk', 'foto_produk.produk_id', 'produk.id')
        .select('produk.*', 'foto_produk.foto_produk')
        .then(async (out) => {
            if (!out || out.length === 0) {
                res.json({
                    status: false,
                    message: "Data not found"
                });
                return;
            }
            await connectDb('rating')
                .where('produk_id', out[0]?.id)
                .then((rating) => {
                    if (!rating || rating.length === 0) {
                        res.json({
                            data: 0
                        });
                        return;
                    }
                    let totalRating = 0;
                    rating.forEach(item => {
                        totalRating += item?.rating;
                    });
                    const products = {}
                    const rating_average = totalRating / rating.length;
                    let bulatSatuDesimal = Math.round(rating_average * 10) / 10;
                    let stringSatuDesimal = bulatSatuDesimal.toFixed(1);

                    out.forEach((row) => {
                        if (!products[row.id]) {
                            products[row.id] = {
                                id: row.id,
                                toko_id: row.toko_id,
                                nama_produk: row.nama_produk,
                                deskripsi_produk: row.deskripsi_produk,
                                harga_produk: row.harga_produk,
                                created_at: row.created_at,
                                updated_at: row.updated_at,
                                rating: stringSatuDesimal,
                                foto_produk: [],
                            };
                        }

                        if (row.foto_produk) {
                            products[row.id].foto_produk.push(row.foto_produk);
                        }
                    });
                    const productList = Object.values(products);

                    res.json({
                        status: true,
                        massage: "Get data success",
                        data: productList,
                    });

                })
                .catch((error) => {
                    res.json({
                        status: false,
                        message: "Get rating data failed",
                        error: error
                    });
                });
        })
        .catch((err) => {
            res.json({
                status: false,
                message: "Get data failed",
                error: err
            });
        });
}
const getProductById = async (req, res) => {
    await connectDb('produk')
        .leftJoin('foto_produk', 'foto_produk.produk_id', 'produk.id')
        .select('produk.*', 'foto_produk.foto_produk')
        .where('produk.id', req?.params?.id)
        .then(async (out) => {
            if (!out || out.length === 0) {
                res.json({
                    status: false,
                    message: "Data not found"
                });
                return;
            }
            await connectDb('rating')
                .where('produk_id', out[0]?.id)
                .then((rating) => {
                    if (!rating || rating.length === 0) {
                        res.json({
                            data: 0
                        });
                        return;
                    }
                    let totalRating = 0;
                    rating.forEach(item => {
                        totalRating += item?.rating;
                    });
                    const products = {}
                    const rating_average = totalRating / rating.length;
                    let bulatSatuDesimal = Math.round(rating_average * 10) / 10;
                    let stringSatuDesimal = bulatSatuDesimal.toFixed(1);

                    out.forEach((row) => {
                        if (!products[row.id]) {
                            products[row.id] = {
                                id: row.id,
                                toko_id: row.toko_id,
                                nama_produk: row.nama_produk,
                                deskripsi_produk: row.deskripsi_produk,
                                harga_produk: row.harga_produk,
                                created_at: row.created_at,
                                updated_at: row.updated_at,
                                rating: stringSatuDesimal,
                                foto_produk: [],
                            };
                        }

                        if (row.foto_produk) {
                            products[row.id].foto_produk.push(row.foto_produk);
                        }
                    });
                    const productList = Object.values(products);

                    res.json({
                        status: true,
                        massage: "Get data success",
                        data: productList,
                    });

                })
                .catch((error) => {
                    res.json({
                        status: false,
                        message: "Get rating data failed",
                        error: error
                    });
                });
        })
        .catch((err) => {
            res.json({
                status: false,
                message: "Get data failed",
                error: err
            });
        });
};


const storeProduct = async (req, res) => {
    const user = await getUserByToken(req?.headers?.authorization?.split(' ')[1])
    const uploadFoto = req?.files

    await connectDb('toko')
        .where('user_id', user?.id)
        .first('*')
        .then(async (toko) => {
            if (toko.length === 0) {
                res.status('404').json({
                    status: false,
                    massage: 'Anda tidak memiliki toko'
                })
            }
            await connectDb('produk')
                .insert({
                    toko_id: toko?.id,
                    nama_produk: req?.body?.nama_produk,
                    deskripsi_produk: req?.body?.deskripsi_produk,
                    harga_produk: req?.body?.harga_produk,
                    jumlah_terjual: 0
                }).then(async (produk) => {
                    uploadFoto.map((foto) => {
                        foto.produk_id = produk[0]
                        foto.foto_produk = `${process.env.SERVER_HOST}/uploads/foto_produk/${foto?.filename}`
                    })
                    const fotoProduk = [];

                    for (const obj of uploadFoto) {
                        const { produk_id, foto_produk } = obj;
                        fotoProduk.push({ produk_id, foto_produk });
                    }

                    await connectDb('foto_produk')
                        .insert(fotoProduk)
                        .then(() => {
                            res.json({
                                status: true,
                                massage: "Insert data success",
                                data: {
                                    toko_id: toko?.id,
                                    nama_produk: req?.body?.nama_produk,
                                    deskripsi_produk: req?.body?.deskripsi_produk,
                                    harga_produk: req?.body?.harga_produk,
                                    foto_produk: fotoProduk
                                }
                            })
                        }).catch((err) => {
                            res.json({
                                status: false,
                                message: 'Insert data failed',
                                error: err
                            })
                        })

                }).catch((err) => {
                    res.json({
                        status: false,
                        message: 'Insert data failed',
                        error: err
                    })
                })
        }).catch(() => {
            return null
        })

}
const deleteProduct = async (req, res) => {
    //TODO: Menambahkan validasi check user
    return await connectDb('produk')
        .where('id', req?.params?.id)
        .del()
        .then(() => {
            res.json({
                status: true,
                massage: "Delete data success",
            })
        }).catch((err) => {
            res.json({
                status: false,
                massage: "Delete data failed",
                error: err
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

const uploadFotoProduct = async (req, res) => {
    res.json({
        file: req?.file
    })
}

module.exports = {
    getAllProduct,
    getProductById,
    storeProduct,
    deleteProduct,
    storeRating,
    uploadFotoProduct
}