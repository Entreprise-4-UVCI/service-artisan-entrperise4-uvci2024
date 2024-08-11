const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authenticateToken = require('../middlewares/auth');

router.post('/create_conversation', chatController.createConversation);
router.post('/send_message', chatController.sendMessage);
router.post('/send_devis', chatController.sendMessageDevis);
router.get('/get_user_conversations/:userId', chatController.getUserConversations);
router.get('/get_conversation/:conversationId', chatController.getConversationById);
router.get('/get_conversation_participants/:conversationId', chatController.getConversationParticipants);
router.post('/add_participant/:conversationId', chatController.addParticipant);
router.delete('/remove_participant/:conversationId/:userId', chatController.removeParticipant);
router.post('/create_group', chatController.createGroup);

module.exports = router;
