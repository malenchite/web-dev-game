const passport = require('passport');
const LocalStrategy = require('./localStrategy');
const db = require('../models');

passport.serializeUser((user, done) => {
  done(null, { _id: user._id });
});

passport.deserializeUser((id, done) => {
  db.User.findOne(
    { _id: id },
    'username email',
    (err, user) => {
      if (err) {
        console.log(err);
      }

      done(null, user);
    }
  );
});

// Register Strategies
passport.use(LocalStrategy);

module.exports = passport;
