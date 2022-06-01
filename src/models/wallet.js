const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    currency: [{
        currencyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Currency',
        },

        currencyAmount: {
            type: Number,
            required: true
        }
    }]
});

const Wallet = mongoose.model('Wallet', walletSchema);

module.exports = Wallet;