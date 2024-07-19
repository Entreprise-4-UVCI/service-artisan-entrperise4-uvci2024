const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Skill = sequelize.define('SkillModel', {
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

module.exports = Skill;
