const Quote = require('../models/QuoteModel');
const Artisan = require('../models/ArtisanModel');
const Payment = require('../models/PaymentModel');
const Transaction = require('../models/TransactionModel');




// Create a new quote
exports.createQuote = async (req, res) => {
    try {
        const { clientName, clientEmail, clientPhone, items, artisanId, clientId } = req.body;
        const totalPrice = items.reduce((acc, item) => acc + item.total, 0);

        const newQuote = new Quote({
            clientName,
            clientEmail,
            clientPhone,
            items,
            totalPrice,
            artisan: artisanId,
            client: clientId
        });

        await newQuote.save();
        res.status(201).json(newQuote);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};



// Get all quotes
exports.getQuotes = async (req, res) => {
    try {
        const quotes = await Quote.find().populate('artisan').populate('client');
        res.status(200).json(quotes);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};



// Get a single quote by ID
exports.getQuoteById = async (req, res) => {
    try {
        const quote = await Quote.findById(req.params.id).populate('artisan').populate('client');
        if (!quote) {
            return res.status(404).json({ message: 'Quote not found' });
        }
        res.status(200).json(quote);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};



// Update a quote
exports.updateQuote = async (req, res) => {
    try {
        const { clientName, clientEmail, clientPhone, items, status } = req.body;
        const totalPrice = items.reduce((acc, item) => acc + item.total, 0);

        const updatedQuote = await Quote.findByIdAndUpdate(
            req.params.id,
            { clientName, clientEmail, clientPhone, items, totalPrice, status, updatedAt: Date.now() },
            { new: true }
        );

        if (!updatedQuote) {
            return res.status(404).json({ message: 'Quote not found' });
        }

        res.status(200).json(updatedQuote);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};



// Pay for a quote
exports.payForQuote = async (req, res) => {
    try {
      const quoteId = req.params.id;
      const quote = await Quote.findById({_id:quoteId}).populate('artisan');
  
      if (!quote) {
        return res.status(404).json({ message: 'Quote not found' });
      }
  
      const artisan = await Artisan.findById({_id:quote.artisan._id});
  
      if (artisan.account.solde < quote.totalPrice) {
        return res.status(400).json({ message: 'Insufficient balance' });
      }
  
      artisan.account.solde -= quote.totalPrice;
      await artisan.save();
  
      quote.status = 'Accepted';
      await quote.save();
  
      // Create a payment record
      const newPayment = new Payment({
        artisanId: artisan._id,
        amount: quote.totalPrice,
        paymentMethod: 'Account Balance',
        transactionId: `TRANS_${Date.now()}`,
        paymentStatus: 'COMPLETED',
        description: 'Payment for quote'
      });
  
      await newPayment.save();
  
      // Create a transaction record
      const newTransaction = new Transaction({
        userId: artisan._id,
        artisanId: quote.artisan._id,
        paymentId: newPayment._id,
        amount: quote.totalPrice,
        currency: 'XOF',
        transactionType: 'SERVICE_PAYMENT',
        transactionStatus: 'COMPLETED',
        description: 'Payment for services'
      });
  
      await newTransaction.save();
  
      res.status(200).json({ message: 'Payment successful', quote, payment: newPayment, transaction: newTransaction });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };




// Delete a quote
exports.deleteQuote = async (req, res) => {
    try {
        const quote = await Quote.findByIdAndDelete(req.params.id);
        if (!quote) {
            return res.status(404).json({ message: 'Quote not found' });
        }
        res.status(200).json({ message: 'Quote deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
