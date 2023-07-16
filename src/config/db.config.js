require('dotenv').config()
const connectDb = require('knex')({
    client: 'mysql',
    connection: {
        host: process.env.DATABASE_HOST,
        port: process.env.DATABASE_PORT,
        user: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME
    }
});

const checkConnectionDb = (req, res, next) => {
    connectDb.raw('SELECT 1').then(() => {
        next()
    }).catch((err) => [
        res.json({
            status: true,
            massage: "Database not connected",
            error: err
        })
    ])
}

module.exports = {
    connectDb,
    checkConnectionDb
}