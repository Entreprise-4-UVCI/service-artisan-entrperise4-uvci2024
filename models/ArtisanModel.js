const { DataTypes, Model } = require('sequelize');
const sequelize = require('../database');

class Artisan extends Model {}

Artisan.init({
    firstname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    company: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    codePostal: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: '225'
    },
    gender: {
        type: DataTypes.ENUM('Male', 'Female', 'Other'),
        defaultValue: 'Male'
    },
    dateOfBirth: {
        type: DataTypes.DATE
    },
    profilePicture: {
        type: DataTypes.STRING
    },
    profession: {
        type: DataTypes.STRING,
        allowNull: false
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('Client', 'Artisan'),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    password: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    services: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false
    },
    skills: {
        type: DataTypes.ARRAY(DataTypes.STRING)
    },
    experienceYears: {
        type: DataTypes.INTEGER
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false
    },
    rating: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    certifications: {
        type: DataTypes.ARRAY(DataTypes.STRING)
    },
    availability: {
        type: DataTypes.ENUM('Available', 'Busy', 'Unavailable'),
        defaultValue: 'Available'
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'UserModels',
            key: 'id'
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
    },
    categoryId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'CategoryModels',
            key: 'id'
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
    }
}, {
    sequelize,
    modelName: 'Artisan'
});

module.exports = Artisan;
