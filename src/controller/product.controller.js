const { connectDb } = require("../config/db.config");
const { getUserByToken } = require("./auth.controller");
const getAllProduct = async (req, res) => {
    return await connectDb('produk')
        .leftJoin('foto_produk', 'foto_produk.produk_id', 'produk.id')
        .select('produk.*', 'foto_produk.foto_produk')
        .then((out) => {
            const products = {};

            out.forEach((row) => {
                if (!products[row.id]) {
                    // Jika produk belum ada dalam objek products, tambahkan
                    products[row.id] = {
                        id: row.id,
                        toko_id: row.toko_id,
                        nama_produk: row.nama_produk,
                        deskripsi_produk: row.deskripsi_produk,
                        harga_produk: row.harga_produk,
                        created_at: row.created_at,
                        updated_at: row.updated_at,
                        foto_produk: [],
                    };
                }

                if (row.foto_produk) {
                    // Jika foto_produk tidak null, tambahkan URL foto ke array foto_produk produk yang sesuai
                    products[row.id].foto_produk.push(row.foto_produk);
                }
            });

            // Konversi objek products menjadi array
            const productList = Object.values(products);

            res.json({
                status: true,
                massage: "Get data success",
                data: productList,
            });
        }).catch((err) => {
            res.json({
                status: false,
                massage: "Get data failed",
                error: err
            })
        })
}
const getProductById = async (req, res) => {

    return await connectDb('produk')
        .leftJoin('foto_produk', 'foto_produk.produk_id', 'produk.id')
        .select('produk.*', 'foto_produk.foto_produk')
        .where('produk.id', req?.params?.id)
        .then((out) => {
            const products = {};

            out.forEach((row) => {
                if (!products[row.id]) {
                    // Jika produk belum ada dalam objek products, tambahkan
                    products[row.id] = {
                        id: row.id,
                        toko_id: row.toko_id,
                        nama_produk: row.nama_produk,
                        deskripsi_produk: row.deskripsi_produk,
                        harga_produk: row.harga_produk,
                        created_at: row.created_at,
                        updated_at: row.updated_at,
                        foto_produk: [],
                    };
                }

                if (row.foto_produk) {
                    // Jika foto_produk tidak null, tambahkan URL foto ke array foto_produk produk yang sesuai
                    products[row.id].foto_produk.push(row.foto_produk);
                }
            });

            // Konversi objek products menjadi array
            const productList = Object.values(products);

            res.json({
                status: true,
                massage: "Get data success",
                data: productList,
            });
        }).catch((err) => {
            res.json({
                status: false,
                massage: "Get data failed",
                error: err
            })
        })
}
const storeProduct = async (req, res) => {
    const user = await getUserByToken(req?.headers?.authorization?.split(' ')[1])
    const uploadFoto = req?.files
    const toko = async () => {
        return await connectDb('toko')
            .where('user_id', user?.id)
            .first('*')
            .then((out) => {
                return out
            }).catch(() => {
                return null
            })
    }

    return await connectDb('produk')
        .insert({
            toko: toko?.id,
            nama_produk: req?.body?.nama_produk,
            deskripsi_produk: req?.body?.deskripsi_produk,
            harga_produk: req?.body?.harga_produk
        })
        .then((data) => {
            connectDb.transaction(function (db) {

                uploadFoto.map((foto) => {
                    foto.product_id = data[0]
                    foto.foto_produk = `${process.env.SERVER_HOST}/uploads/foto_produk/${foto?.filename}`
                })
                const fotoProduk = [];

                for (const obj of uploadFoto) {
                    const { product_id, foto_produk } = obj;
                    fotoProduk.push({ product_id, foto_produk });
                }

                connectDb('foto_produk').transacting(db)
                    .insert(fotoProduk)
                    .then(db.commit)
                    .catch(db.rollback)
            })
                .then(() => {

                    uploadFoto.map((foto) => {
                        foto.foto_produk = `${process.env.SERVER_HOST}/uploads/foto_produk/${foto?.filename}`
                    })
                    const fotoProduk = [];

                    for (const obj of uploadFoto) {
                        const { foto_produk } = obj;
                        fotoProduk.push({ foto_produk });
                    }

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
                }).catch(() => {
                    res.json({
                        status: false,
                        massage: "Insert data failed",
                    })
                })

        }).catch((err) => {
            res.json({
                status: false,
                massage: "Insert data failed",
                error: err
            })
        })
}
const deleteProduct = async (req, res) => {
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
    uploadFotoProduct
}