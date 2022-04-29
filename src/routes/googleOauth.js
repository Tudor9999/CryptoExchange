var express = require("express");
var passport = require("passport");
var GoogleStrategy = require("passport-google-oauth20").Strategy;
const constants = require("../constants/values.js");
const User = require("../models/user.js");

var server = express();

const GOOGLE_CLIENT_ID =
  "869350734547-8uq8tphcaleu16oblbeg599j1pk95phs.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      process.nextTick(function () {
        return done(null, profile);
      });
    }
  )
);

server.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
  })
);

server.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: constants.UNAUTHORIZED_URL,
  }),
  async function (req, res) {
    const { id, displayName, emails } = req.user;
    const filter = { userId: id, email: emails[0].value };
    const entry = {
      ...filter,
      displayName,
      provider: "google",
    };
    const qRes = await User.findOne(filter);
    if (!qRes) {
      await User.create(entry);
    } else {
      await User.updateOne(filter, { lastLogin: new Date() });
    }
    res.redirect(`/api/users/${req.user.id}`);
  }
);

module.exports = server;
