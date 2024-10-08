const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const applicationSchema = new Schema({
    projectId: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    artisanId: {
        type: Schema.Types.ObjectId,
        ref: 'Artisan',
        required: true,
    },
    
    clientId: {
        type: Schema.Types.ObjectId,
        ref: 'Artisan',
        required: true,
    },
    choiceBudget:{
        type:Number,
        default:0,
        required:true
    },    
    message: {
        type: String,
        required: false
    },
    status: {
        type: String,
        enum: ['PENDING', 'ACCEPTED', 'REJECTED'],
        default: 'PENDING',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
},{timestamps:true});

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;
