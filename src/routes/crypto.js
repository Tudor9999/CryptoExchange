const express = require('express');
const router = express.Router();
const Currency = require("../models/currency");
const auth = require("../middleware/authJwt");

router.post('/api/addcrypto', async(req, res) =>{
    const { currencyName, ratio, amount } = req.body;

    const currency = {
        currencyName,
        ratio,
        amount
    };

    const currencyExists = await Currency.findOne({ currencyName });

    if(!currencyExists){
        Currency.create(currency).then((currency) =>{
            res.status(200).json(currency);
        });
    }else{
        res.status(401).json("Currency already exists");
    }

});

router.get('/api/crypto', auth, async(req, res) =>{
    const cryptoList = await Currency.find();

    if(!cryptoList){
        res.status(404).json("The list of crypto not found!");
    }else{
        res.status(200).json(cryptoList);
    }
});

module.exports = router;