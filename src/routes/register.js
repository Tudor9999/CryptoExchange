import { BadRequestError } from '../utils/errors';

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const createWallet = require('../utils/createWallet');

router.post('/api/user/register', async (req, res) =>{


    //Check if username, email, password already exist
    const usernameExist = await User.findOne({username: req.body.username});
    const emailExist = await User.findOne({email: req.body.email});
    const passwordExist = await User.findOne({password: req.body.password});

    if(usernameExist) return res.status(400).send('Username already exists');
    if(emailExist) return res.status(400).send('Email already exists');
    if(passwordExist) return res.status(400).send('Password already exists');

    //Hash passwords
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);


    //Create new user
    const user = {
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        phone: req.body.phone
    };
    
    const foundUser = await User.findOne({username: req.body.username});
    await createWallet(foundUser, user, res);


});


module.exports = router;