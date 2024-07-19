const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Category = sequelize.define('CategoryModel', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    timestamps: false,
});

module.exports = Category;
