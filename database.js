const { Sequelize } = require('sequelize');
const dotenv =  require("dotenv");
dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    password:process.env.PASSWORD_DB,
    username:process.env.USER_NAME_DB,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false // This is important if you're connecting to Heroku Postgres
        }
    }
});

module.exports = sequelize;
