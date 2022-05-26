import bcrypt from 'bcryptjs/dist/bcrypt';
import { BadRequestError } from '../utils/errors';

const express = require('express');
const router = express.Router();
const User = require('../models/user');
const verify = require('../middleware/authJwt');

router.post('/api/user/changePassword', verify, async (req, res) =>{
    const user = await User.findById({_id: req.user._id});
    const { oldPass, newPass } = req.body;

    if(!user){
        return res.status(404).json("User not found!");
    }

    let confirm;
    await bcrypt.compare(oldPass, user.password).then((result) => {
        confirm = result;
    });


    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPass, salt);
    if (confirm) {
        await User.findByIdAndUpdate({ _id: req.user._id}, { password: hashedPassword});
        return res.status(200).json("Password updated!");
    } else {
        return res.status(402).json("Wrong Password");
    }

})

module.exports = router;