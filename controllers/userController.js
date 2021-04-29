const db = require('../models');

// The different methods that are utilized by user controller
module.exports = {
  // gets the user data
  getUser: (req, res, next) => {
    if (req.user) {
      return res.json({ user: req.user });
    } else {
      return res.json({ user: null });
    }
  },
  // controller for registering the user
  register: (req, res) => {
    const { email, username, password } = req.body;
    // Linter didnt like that the err wasnt prefixed by a "_"
    db.User.findOne({ 'email': email }, (_err, userMatch) => {
      if (userMatch) {
        return res.json({
          error: `Please select a different username, we already have a user with that name: ${email}`
        });
      }
      const newUser = new db.User({
        'username': username,
        'email': email,
        'password': password
      });
      newUser.save((err, savedUser) => {
        if (err) return res.json(err);
        return res.json(savedUser);
      });
    });
  },
  // logs the user out
  logout: (req, res) => {
    if (req.user) {
      req.session.destroy();
      res.clearCookie('connect.sid');
      return res.json({ msg: 'logging you out' });
    } else {
      return res.json({ msg: 'no user to log out!' });
    }
  },
  auth: function (req, res, next) {
    next();
  },
  authenticate: (req, res) => {
    const user = JSON.parse(JSON.stringify(req.user));
    const cleanUser = Object.assign({}, user);
    if (cleanUser) {
      delete cleanUser.password;
    }
    res.json({ user: cleanUser });
  }
};
