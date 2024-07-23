const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    }
}, {
    timestamps: false
});

const Skill = mongoose.model('Skill', SkillSchema);

module.exports = Skill;
