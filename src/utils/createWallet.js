const Wallet = require('../models/wallet');
const User = require("../models/user");
const Currency = require('../models/currency');

const createWallet = async (foundUser, user, res) => {
    if(!foundUser){
        try {
            const xUSD = await Currency.findOne({"currencyName": "xUSD"});
            const userCreated = await User.create(user);
            const wallet = await Wallet.create({
                userId: userCreated._id,
                currency: [
                    {
                        currencyId: xUSD._id,
                        currencyAmount: 1000
                    }
                ]
            });
            res.status(200).json({
                message: "User successfully created",
                user: userCreated,
                wallet
            });
        } catch (error) {
            res.status(400).json(error);
        }
    } else {
        res.status(401).json("User not ceated");
    }
}

module.exports = createWallet;

