const sequelize = require('../database');
const User = require('./UserModel');
const Artisan = require('./ArtisanModel');
const Project = require('./ProjetcModel');
const Category = require('./CategoryModel');
const Skill = require('./SkillModel');
const Application = require('./ApplicationModel');
const Review = require('./ReviewModel');

// Associations
Artisan.belongsTo(User, { foreignKey: 'userId' });
Artisan.belongsTo(Category, { foreignKey: 'categoryId' });
Project.belongsTo(User, { foreignKey: 'clientId' });
Project.belongsTo(Category, { foreignKey: 'categoryId' });
Project.belongsToMany(Skill, { through: 'ProjectSkill' });
Skill.belongsToMany(Project, { through: 'ProjectSkill' });
Artisan.belongsToMany(Skill, { through: 'ArtisanSkill' });
Skill.belongsToMany(Artisan, { through: 'ArtisanSkill' });

Application.belongsTo(Project, { foreignKey: 'projectId' });
Application.belongsTo(Artisan, { foreignKey: 'artisanId' });

Review.belongsTo(User, { foreignKey: 'clientId' });
Review.belongsTo(Artisan, { foreignKey: 'artisanId' });

module.exports = {
    sequelize,
    User,
    Artisan,
    Project,
    Category,
    Skill,
    Application,
    Review,
};
