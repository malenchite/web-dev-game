const db = require('../models');
const LocalStrategy = require('passport-local').Strategy;

const strategy = new LocalStrategy({
  usernameField: 'username' // not necessary, DEFAULT
},
  function (username, password, done) {
    db.User.findOne({ 'username': username }, (err, userMatch) => {
      if (err) {
        console.log(err)
        return done(err, false, { message: "User does not exist" });
      }
      if (!userMatch) {
        return done(null, false, { message: 'Incorrect username' });
      }
      if (!userMatch.checkPassword(password)) {
        return done(null, false, { message: 'Incorrect password' });
      }

      return done(null, userMatch);
    });
  }
);

module.exports = strategy;
