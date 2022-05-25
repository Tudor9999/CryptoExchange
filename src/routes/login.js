import bcrypt from 'bcryptjs/dist/bcrypt';
import { BadRequestError } from '../utils/errors';

const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require("jsonwebtoken");
const passport = require('passport');
const LocalStrategy = require('passport-local');

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


module.exports = router;