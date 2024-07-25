const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    clientId: {
       type:String
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['OPEN', 'PENDING', 'COMPLETED', 'CANCELLED'],
        default: 'PENDING'
    },
    location: {
        type: String,
        required: false
    },
    minBudget: {
        type: Number,
        required: true
    },
    maxBudget: {
        type: Number,
        required: true
    },
    deadline: {
        type: Date,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    skills: {
        type: [Object]
    },
    category: {
        type:Object
    }
}, {
    timestamps: false
});

const Project = mongoose.model('Project', ProjectSchema);

module.exports = Project;
