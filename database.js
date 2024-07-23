const { Sequelize } = require('sequelize');
const dotenv = require("dotenv");
dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    password: process.env.PASSWORD_DB,
    username: process.env.USER_NAME_DB,
    dialectOptions: {
        ssl: process.env.USE_SSL === 'true' ? {
            require: true,
            rejectUnauthorized: false // Important si vous vous connectez à Heroku Postgres
        } : false
    }
});

module.exports = sequelize;
