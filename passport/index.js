const passport = require('passport');
const LocalStrategy = require('./localStrategy');
const db = require('../models');

passport.serializeUser((user, done) => {
// console.log ('Serialize called');
// console.log(user); // whole raw user object

  done(null, { _id: user._id });
});

passport.deserializeUser((id, done) => {
  db.User.findOne(
    { _id: id },
    'firstName lastName username',
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
