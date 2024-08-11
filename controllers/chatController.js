const { Conversation, Message } = require('../models/ChatModel');
const Artisan = require('../models/ArtisanModel');
const Quote = require('../models/QuoteModel');

exports.createConversation = async (req, res) => {
  const { senderId, receiverId } = req.body;
  try {
    const sender = await Artisan.findById({ _id: senderId });
    const receiver = await Artisan.findById({ _id: receiverId });
    if (!sender || !receiver) {
      return res.status(404).json({ message: 'Utilisateur introuvable' });
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] }
    });

    if (!conversation) {
      conversation = new Conversation({ participants: [senderId, receiverId] }).populate({
        path: 'messages',
        populate: {
          path: 'quote',
          model: 'Quote',
        },
      })
        .populate({
          path: 'participants',
          select: 'username firstname lastname phone email codePostal profilePicture'
        });
      await conversation.save();
      sender.conversations.push(conversation._id);
      receiver.conversations.push(conversation._id);
      await sender.save();
      await receiver.save();
    }

    return res.status(201).json({ conversation });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.sendMessage = async (req, res) => {
  const { conversationId, senderId, content } = req.body;
  try {
    const conversation = await Conversation.findById({ _id: conversationId }).populate({
      path: 'messages',
      populate: {
        path: 'quote',
        model: 'Quote',
      },
    })
      .populate({
        path: 'participants',
        select: 'username firstname lastname phone email codePostal profilePicture'
      });
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation introuvable' });
    }

    // if (!conversation.participants.includes(senderId)) {
    //   return res.status(403).json({ message: 'Utilisateur non autorisé à envoyer un message dans cette conversation' });
    // }
    const message = new Message({ sender: senderId, content });
    await message.save();

    conversation.messages.push(message._id);
    await conversation.save();

    return res.status(201).json({ data: conversation });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


//
exports.sendMessageDevis = async (req, res) => {
  const { conversationId, senderId, content, title, items, clientId } = req.body;
  try {
    const totalPrice = items.reduce((acc, item) => acc + item.total, 0);

    const newQuote = new Quote({
      title,
      items,
      totalPrice,
      clientId: clientId
    });

    await newQuote.save();

    const conversation = await Conversation.findById({ _id: conversationId }).populate({
      path: 'messages',
      populate: {
        path: 'quote',
        model: 'Quote',
      },
    })
      .populate({
        path: 'participants',
        select: 'username firstname lastname phone email codePostal profilePicture'
      });

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation introuvable' });
    }

    if (!conversation.participants.includes(senderId)) {
      return res.status(403).json({ message: 'Utilisateur non autorisé à envoyer un message dans cette conversation' });
    }

    const message = new Message({ sender: senderId, content, quote: newQuote });
    await message.save();

    conversation.messages.push(message._id);
    await conversation.save();

    return res.status(201).json({ data: conversation });
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({ message: error.message });
  }
};



exports.getUserConversations = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await Artisan.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable' });
    }

    const conversations = await Conversation.find({ participants: userId })
      .populate({
        path: 'participants',
        select: 'username firstname lastname phone email codePostal profilePicture'
      })
      .populate('messages')
      .sort({ updatedAt: -1 }); // Trier par date de modification décroissante

    return res.status(200).json({ data: conversations, message: "Conversations de l'utilisateur récupérées avec succès" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


exports.getConversationById = async (req, res) => {
  const { conversationId } = req.params;
  try {
    const conversation = await Conversation.findById(conversationId)
      .populate({
        path: 'messages',
        populate: {
          path: 'quote',
          model: 'Quote',
        },
      })
      .populate({
        path: 'participants',
        select: 'username firstname lastname phone email codePostal profilePicture'
      })
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation introuvable' });
    }

    console.log(conversation);
    return res.status(200).json({ data: conversation });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};



exports.getConversationParticipants = async (req, res) => {
  const { conversationId } = req.params;
  try {
    const conversation = await Conversation.findById(conversationId)
      .populate('participants', 'username');
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation introuvable' });
    }

    return res.status(200).json({ participants: conversation.participants });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.addParticipant = async (req, res) => {
  const { conversationId } = req.params;
  const { userId } = req.body;
  try {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation introuvable' });
    }

    const user = await Artisan.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable' });
    }

    if (!conversation.participants.includes(userId)) {
      conversation.participants.push(userId);
      await conversation.save();
    }

    return res.status(200).json({ message: 'Utilisateur ajouté à la conversation avec succès' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.removeParticipant = async (req, res) => {
  const { conversationId, userId } = req.params;
  try {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation introuvable' });
    }

    conversation.participants.pull(userId);
    await conversation.save();

    return res.status(200).json({ message: 'Utilisateur retiré de la conversation avec succès' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.createGroup = async (req, res) => {
  const { groupName, participants } = req.body;
  try {
    if (!participants || participants.length < 2) {
      return res.status(400).json({ message: 'Un groupe doit avoir au moins deux participants' });
    }

    const users = await Artisan.find({ _id: { $in: participants } });
    if (users.length !== participants.length) {
      return res.status(404).json({ message: 'Certains participants sont introuvables' });
    }

    const group = new Conversation({ isGroup: true, groupName, participants });
    await group.save();

    for (const participantId of participants) {
      const participant = await Artisan.findById(participantId);
      participant.conversations.push(group._id);
      await participant.save();
    }

    return res.status(201).json({ group });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
