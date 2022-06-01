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

module.exports = router;