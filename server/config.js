require('dotenv').config();
module.exports = {
    dbUrl: process.env.DB_URI,
    jwtSecret: process.env.JWT_SECRET
}
