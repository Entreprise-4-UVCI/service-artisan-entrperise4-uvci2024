const mongoose = require('mongoose');

const ArtisanSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: false
    },
    lastname: {
        type: String,
        required: false
    },
    company: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: false,
    },
    phone: {
        type: String,
        required: false,
    },
    codePostal: {
        type: String,
        required: false,
        default: '225'
    },
    gender: {
        type: Object,
        default: 'Male'
    },
    dateOfBirth: {
        type: String
    },
    profilePicture: {
        type: String
    },
    profession: {
        type: String,
        required: false
    },
    address: {
        type: String,
        required: false
    },
    role: {
        type: String,
        enum: ['Client', 'Artisan'],
        required: false
    },
    description: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: false
    },
    services: {
        type: [Object],
        required: false
    },
    skills: {
        type: [Object]
    },
    experienceYears: {
        type: Number
    },
    location: {
        type: String,
        required: false
    },
    rating: {
        type: Number,
        default: 0
    },
    certifications: {
        type: [Object]
    },
    availability: {
        type: String,
        enum: ['Available', 'Busy', 'Unavailable'],
        default: 'Available'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    // emplacement
    country:{
        type:Object,
        default:{
            value:"Côte d'Ivoire",
            label:"Côte d'Ivoire"
        }
    },
    language:{
        type:Object,
        default:{
            value:"fr",
            label:"Français",
        }
    },
    city:{
        type:Object,default:{
            value:"Abidjan",
            label:"Abidjan"
        }
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },


    // solde
    account: {
        solde: {
            type: Number, default: 5000
        },
        pack: {
            title: { String },
            dateStart: { type: Date },
            dateEnd: { type: Date },
            possibilities: {
                type: Number,
                default: 0
            }
        }
    },




    // chat
    conversations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'conversations'
    }],
    online: {
        type: Boolean,
        default: false
    },
    lastSeen: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const Artisan = mongoose.model('Artisan', ArtisanSchema);

module.exports = Artisan;
