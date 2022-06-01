const mongoose = require('mongoose');

const currencySchema = new mongoose.Schema({
    currencyName: {
        type: String,
        unique: true,
        required: true
    },

    ratio: {
        type: Number,
        required: true
    },

    amount: {
        type: Number,
        required: true
    }
});

const Currency = mongoose.model('Currency', currencySchema);

module.exports = Currency;