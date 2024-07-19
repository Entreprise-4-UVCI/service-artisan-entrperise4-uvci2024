const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const User = require('./UserModel');
const Artisan = require('./ArtisanModel');

const Review = sequelize.define('Review', {
    clientId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id'
        },
        allowNull: false,
    },
    artisanId: {
        type: DataTypes.INTEGER,
        references: {
            model: Artisan,
            key: 'id'
        },
        allowNull: false,
    },
    rating: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    timestamps: false,
});

Review.belongsTo(User, { foreignKey: 'clientId' });
Review.belongsTo(Artisan, { foreignKey: 'artisanId' });

module.exports = Review;
