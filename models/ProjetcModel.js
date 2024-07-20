const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const User = require('./UserModel');
const Category = require('./CategoryModel');
const Skill = require('./SkillModel');
const Artisan = require('./ArtisanModel');

const Project = sequelize.define('Project', {
    clientId: {
        type: DataTypes.INTEGER,
        references: {
            model: Artisan,
            key: 'id'
        },
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('OPEN', 'PENDIND', 'COMPLETED', 'CANCELLED'),
        defaultValue: 'PENDIND',
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    minBudget: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    maxBudget: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    deadline: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    timestamps: false,
});

Project.belongsTo(Artisan, { foreignKey: 'clientId' });
Project.belongsTo(Category, { foreignKey: 'categoryId' });

const ProjectSkill = sequelize.define('ProjectSkill', {}, { timestamps: false });
Project.belongsToMany(Skill, { through: ProjectSkill });
Skill.belongsToMany(Project, { through: ProjectSkill });

module.exports = Project;
