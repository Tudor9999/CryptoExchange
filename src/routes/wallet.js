const express = require('express');
const router = express.Router();
const Currency = require('../models/currency');
const Wallet = require('../models/wallet');
const auth = require('../middleware/authJwt');

router.get('/api/wallet', auth, async(req,res) =>{
    const wallet = await Wallet.find({
        userId: req.user._id
    });

    if(!wallet){
        return res.status(404).json("Wallet not found");
    }
    return res.status(200).json({
        wallet
    });
});

router.put("/api/deposit-funds", auth, async (req, res) =>{
    const { amount } = req.body;
    const wallet = await Wallet.findOne({ userId: req.user._id});
    const xUSD = await Currency.findOne({ "currencyName": "xUSD"});

    const totalAmount = wallet.currency[0].currencyAmount + amount
    await Wallet.findOneAndUpdate({
        userId: req.user._id,
        "currency.currencyId": xUSD._id
    }, {
        $set: {
            "currency.$.currencyAmount": totalAmount
        }
    })
    res.status(200).json({
        message: "Successful deposit",
        wallet
    });

});


module.exports = router;