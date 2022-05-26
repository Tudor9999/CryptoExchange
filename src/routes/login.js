import bcrypt from 'bcryptjs/dist/bcrypt';
import { BadRequestError } from '../utils/errors';

const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require("jsonwebtoken");
const passport = require('passport');
const LocalStrategy = require('passport-local');
/*
passport.use(
    new LocalStrategy(
        (username, password, done) => {
            User.findOne({ username: username}, async (err, user) => {
                if (err) {return done(err);}
                if (!user) {return done(null, false); }

                const valid = await bcrypt.compare(password, user.password).then(resp => resp)

                if (valid) {
                    await User.updateOne(user, {lastLogin: new Date()})
                    done(null, user)
                }
                else return done(null, false)
            });
        }
    )
)

passport.serializeUser( (user, done) => {
    done(null, user.id)
})
  
passport.deserializeUser( (obj, done) => {
    done(null, obj)
})
  
router.post('/api/user/login', passport.authenticate('local', { 
        failureFlash: true
    }), 
    (req, res) => {
    res.redirect(`/api/user/${req.session.passport.user.id}`)
})
*/


//Login
router.post('/api/user/login', async (req, res) =>{
    //Check if username is correct
    const user = await User.findOne({username: req.body.username});
    if(!user) return res.status(400).send('Username is not found!');
    //Check if password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send('Password is incorrect!');

    //Create and assign a token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);
    
});



module.exports = router;