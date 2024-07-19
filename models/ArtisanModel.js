const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const User = require('./UserModel');
const Category = require('./CategoryModel');
const Skill = require('./SkillModel');

const Artisan = sequelize.define('Artisan', {
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id'
        },
        allowNull: false,
    },
    profession: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    services: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
    },
    skills: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
    },
    experienceYears: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    location: {
        type: DataTypes.GEOMETRY('POINT'),
        allowNull: false,
    },
    rating: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
    },
    certifications: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
    },
    availability: {
        type: DataTypes.ENUM('Available', 'Busy', 'Unavailable'),
        defaultValue: 'Available',
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    timestamps: false,
});

Artisan.belongsTo(User, { foreignKey: 'userId' });
Artisan.belongsTo(Category, { foreignKey: 'categoryId' });

const ArtisanSkill = sequelize.define('ArtisanSkill', {}, { timestamps: false });
Artisan.belongsToMany(Skill, { through: ArtisanSkill });
Skill.belongsToMany(Artisan, { through: ArtisanSkill });

module.exports = Artisan;
