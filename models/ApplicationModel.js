const { DataTypes, Model } = require('sequelize');
const sequelize = require('../database');

class Application extends Model {}

Application.init({
    projectId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Projects',
            key: 'id'
        },
        onDelete: 'NO ACTION',
        onUpdate: 'CASCADE'
    },
    artisanId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: {
            model: 'Artisans',
            key: 'id'
        },
        onDelete: 'NO ACTION',
        onUpdate: 'CASCADE'
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('PENDING', 'ACCEPTED', 'REJECTED'),
        defaultValue: 'PENDING',
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    sequelize,
    modelName: 'Application'
});

module.exports = Application;
