const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const Project = require('./ProjetcModel');
const Artisan = require('./ArtisanModel');

const Application = sequelize.define('Application', {
    projectId: {
        type: DataTypes.INTEGER,
        references: {
            model: Project,
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
    message: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('Pending', 'Accepted', 'Rejected'),
        defaultValue: 'Pending',
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    timestamps: false,
});

Application.belongsTo(Project, { foreignKey: 'projectId' });
Application.belongsTo(Artisan, { foreignKey: 'artisanId' });

module.exports = Application;
