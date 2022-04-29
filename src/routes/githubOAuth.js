const express = require("express");
const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const constants = require("../constants/values.js");
const User = require("../models/user");

var server = express();

const GITHUB_CLIENT_ID = "52a36a1d1d768ff47a3c";
const GITHUB_CLIENT_SECRET = "c145d308c588882702cd6112c9c1ca3638b3ea04";

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

passport.use(
  new GitHubStrategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/github/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      process.nextTick(function () {
        return done(null, profile);
      });
    }
  )
);

server.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
);
server.get(
  "/auth/github/callback",
  passport.authenticate("github", {
    failureRedirect: constants.UNAUTHORIZED_URL,
  }),
  async function (req, res) {
    const { id, displayName, username, provider } = req.user;
    const filter = { userId: id, username };
    const entry = {
      ...filter,
      displayName,
      provider,
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
