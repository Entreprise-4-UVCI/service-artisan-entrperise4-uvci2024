const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authenticateToken = require('../middlewares/auth');

router.post('/create_conversation', authenticateToken, chatController.createConversation);
router.post('/send_message', authenticateToken, chatController.sendMessage);
router.get('/get_user_conversations/:userId', authenticateToken, chatController.getUserConversations);
router.get('/get_conversation/:conversationId', authenticateToken, chatController.getConversationById);
router.get('/get_conversation_participants/:conversationId', authenticateToken, chatController.getConversationParticipants);
router.post('/add_participant/:conversationId', authenticateToken, chatController.addParticipant);
router.delete('/remove_participant/:conversationId/:userId', authenticateToken, chatController.removeParticipant);
router.post('/create_group', authenticateToken, chatController.createGroup);

module.exports = router;
