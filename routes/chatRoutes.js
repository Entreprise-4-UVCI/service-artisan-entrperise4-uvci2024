const express = require('express');
const router = express.Router();
const { Conversation, Message } = require('../models/ChatModel');
const Artisan = require('../models/ArtisanModel');

// Créer une nouvelle conversation entre deux utilisateurs
router.post('/create_conversation', async (req, res) => {
    const { senderId, receiverId } = req.body;
    try {
        // Vérifier si les utilisateurs existent
        const sender = await Artisan.findById({senderId});
        const receiver = await Artisan.findById(receiverId);
        if (!sender || !receiver) {
            return res.status(404).json({ message: 'Utilisateur introuvable' });
        }

        // Vérifier si une conversation entre ces utilisateurs existe déjà
        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        });

        // Si aucune conversation existante, créer une nouvelle conversation
        if (!conversation) {
            conversation = new Conversation({
                participants: [senderId, receiverId]
            });
            await conversation.save();

            // Mettre à jour la liste des conversations des utilisateurs
            sender.conversations.push(conversation._id);
            receiver.conversations.push(conversation._id);
            await sender.save();
            await receiver.save();
        }

        return res.status(201).json({ conversation });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// Envoyer un message dans une conversation existante
router.post('/send_message', async (req, res) => {
    const { conversationId, senderId, content } = req.body;
    try {
        // Vérifier si la conversation existe
        const conversation = await Conversation.findById({ _id: conversationId });
        if (!conversation) {
            return res.status(404).json({ message: 'Conversation introuvable' });
        }

        // Vérifier si l'utilisateur est participant de la conversation
        if (!conversation.participants.includes(senderId)) {
            return res.status(403).json({ message: 'Utilisateur non autorisé à envoyer un message dans cette conversation' });
        }

        // Créer et enregistrer le nouveau message
        const message = new Message({ sender: senderId, content });
        await message.save();

        // Ajouter le message à la conversation
        conversation.messages.push(message._id);
        await conversation.save();

        return res.status(201).json({ data: conversation });
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ message: error.message });
    }
});

// Récupérer toutes les conversations d'un utilisateur
router.get('/get_user_conversations/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        // Trouver l'utilisateur
        const user = await Artisan.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur introuvable' });
        }

        // Récupérer toutes les conversations auxquelles l'utilisateur participe
        const conversations = await Conversation.find({ participants: userId })
            .populate({
                path: 'participants',
                select: 'username firstname lastname shopName telephone codePostal dateJour is_active coverPicture' // Sélectionnez les champs que vous souhaitez inclure
            })
            .populate('messages');

        return res.status(200).json({ data: conversations, message: "Conversations de l'utilisateur récupérées avec succès" });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: error.message });
    }
});




// Récupérer une conversation par son ID
router.get('/get_conversation/:conversationId', async (req, res) => {
    const { conversationId } = req.params;
    try {
        // Trouver la conversation par son ID
        const conversation = await Conversation.findById({ _id: conversationId }).populate('messages').populate('participants', 'username');
        if (!conversation) {
            return res.status(404).json({ message: 'Conversation introuvable' });
        }

        return res.status(200).json({ data: conversation });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});







// Récupérer les participants d'une conversation
router.get('/get_conversation_participants/:conversationId', async (req, res) => {
    const { conversationId } = req.params;
    try {
        // Trouver la conversation par son ID
        const conversation = await Conversation.findById({ _id: conversationId }).populate('participants', 'username');
        if (!conversation) {
            return res.status(404).json({ message: 'Conversation introuvable' });
        }

        // Renvoyer la liste des participants
        return res.status(200).json({ participants: conversation.participants });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// Récupérer les conversations d'un utilisateur
router.get('/get_user_conversations/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        // Trouver l'utilisateur par son ID
        const user = await Artisan.findById({ _id: userId });
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur introuvable' });
        }

        // Récupérer toutes les conversations auxquelles l'utilisateur participe
        const conversations = await Conversation.find({ participants: userId }).populate('messages').populate('participants', 'username');
        return res.status(200).json({ conversations });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// Ajouter un participant à une conversation
router.post('/add_participant/:conversationId', async (req, res) => {
    const { conversationId } = req.params;
    const { userId } = req.body;
    try {
        // Vérifier si la conversation existe
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            return res.status(404).json({ message: 'Conversation introuvable' });
        }

        // Vérifier si l'utilisateur existe
        const user = await Artisan.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur introuvable' });
        }

        // Ajouter l'utilisateur à la conversation s'il n'est pas déjà participant
        if (!conversation.participants.includes(userId)) {
            conversation.participants.push(userId);
            await conversation.save();
        }

        return res.status(200).json({ message: 'Utilisateur ajouté à la conversation avec succès' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// Supprimer un participant d'une conversation
router.delete('/remove_participant/:conversationId/:userId', async (req, res) => {
    const { conversationId, userId } = req.params;
    try {
        // Vérifier si la conversation existe
        const conversation = await Conversation.findById({ _id: conversationId });
        if (!conversation) {
            return res.status(404).json({ message: 'Conversation introuvable' });
        }

        // Supprimer l'utilisateur de la liste des participants de la conversation
        conversation.participants.pull(userId);
        await conversation.save();

        return res.status(200).json({ message: 'Utilisateur retiré de la conversation avec succès' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});






// Créer un nouveau groupe de conversation
router.post('/create_group', async (req, res) => {
    const { groupName, participants } = req.body;
    try {
        // Vérifier si des participants sont fournis
        if (!participants || participants.length < 2) {
            return res.status(400).json({ message: 'Un groupe doit avoir au moins deux participants' });
        }

        // Vérifier si les participants existent
        const users = await Artisan.find({ _id: { $in: participants } });
        if (users.length !== participants.length) {
            return res.status(404).json({ message: 'Certains participants sont introuvables' });
        }

        // Créer le nouveau groupe
        const group = new Conversation({
            isGroup: true,
            groupName,
            participants
        });
        await group.save();

        // Mettre à jour les listes de conversations des participants
        for (const participantId of participants) {
            const participant = await Artisan.findById(participantId);
            participant.conversations.push(group._id);
            await participant.save();
        }

        return res.status(201).json({ group });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});




module.exports = router;