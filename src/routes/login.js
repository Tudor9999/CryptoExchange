import bcrypt from 'bcryptjs/dist/bcrypt';
import { BadRequestError } from '../utils/errors';

const express = require('express');
const router = express.Router();
const User = require('../models/user');


//Login
router.post('/api/user/login', async (req, res) =>{
    //Check if username is correct
    const user = await User.findOne({username: req.body.username});
    if(!user) return res.status(400).send('Username is not found!');
    //Check if password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send('Password is incorrect!');

    res.send('Logged in!');
    
});



module.exports = router;