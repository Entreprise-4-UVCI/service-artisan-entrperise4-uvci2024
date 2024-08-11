const mongoose = require('mongoose');



// Schéma pour les conversations
const conversationSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artisan'
    }],
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'messages'
    }],
    isGroup: {
        type: Boolean,
        default: false
    },
    groupName: {
        type: String
    }
}, { timestamps: true });

// Schéma pour les messages
const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artisan',
        required: true
    },
    content: {
        type: String,
        required: false
    },
    quote: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quote',
        required: false
    },
    status: {
        type: String,
        enum: ['sent', 'delivered', 'read'],
        default: 'sent'
    },
    
}, { timestamps: true });

// Modèles
const Conversation = mongoose.model('conversations', conversationSchema);
const Message = mongoose.model('messages', messageSchema);

module.exports = {
    Conversation,
    Message
};