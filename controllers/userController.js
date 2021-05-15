const db = require('../models');

// The different methods that are utilized by user controller
module.exports = {
  /* Authorization methods */

  /* Gets user data for currently logged-in user */
  getUser: (req, res, next) => {
    if (req.user) {
      return res.json({
        user: {
          _id: req.user._id,
          username: req.user.username,
          email: req.user.email,
          avatar: req.user.avatar
        }
      });
    } else {
      return res.json({ user: null });
    }
  },
  /* Register a new user with the provided info */
  register: (req, res) => {
    const { email, username, password } = req.body;
    db.User.findOne({ 'email': email }, (_err, emailMatch) => {
      if (emailMatch) {
        return res.json({
          error: `We already have a user with that email: ${email}`
        });
      }
      db.User.findOne({ 'username': username }, (_err, userMatch) => {
        if (userMatch) {
          return res.json({
            error: `We already have a user with that username: ${username}`
          });
        }

        const newUser = new db.User({
          'username': username,
          'email': email,
          'password': password
        });

        newUser.save((err, savedUser) => {
          if (err) return res.json(err);
          const user = JSON.parse(JSON.stringify(savedUser));
          delete user.password;
          return res.json(user);
        });
      });
    });
  },
  /* Logs out the current user by deleting their session */
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
  /* Sends user data, cleaned of password and game history */
  authenticate: (req, res) => {
    const user = JSON.parse(JSON.stringify(req.user));
    const cleanUser = Object.assign({}, user);
    if (cleanUser) {
      delete cleanUser.gamehistory;
      delete cleanUser.password;
    }
    res.json({ user: cleanUser });
  },
  /* Game history methods */

  /* Retrieve the entire game history array for a given user */
  getGameHistory: (req, res) => {
    db.User.findById(req.params.id, (_err, user) => {
      const gameHistory = user.gamehistory;
      if (gameHistory) {
        res.json(gameHistory);
      } else {
        res.status(404).end();
      }
    })
      .catch(err => console.log(err));
  },
  /* Saves a new game to a user's game history */
  saveGameHistory: (req, res) => {
    db.User.findById(req.params.id, (_err, user) => {
      if (user) {
        const { result, frontEndCorrect, frontEndTotal, backEndCorrect, backEndTotal, timestamp } = req.body;
        const gameData = {
          result,
          frontEndCorrect,
          frontEndTotal,
          backEndCorrect,
          backEndTotal,
          timestamp
        };
        db.User.updateOne({ '_id': user._id }, { '$push': { 'gamehistory': gameData } })
          .then(() => {
            res.status(200).end();
          }
          );
      } else {
        res.status(404).end();
      }
    });
  },
  /* Other methods */
  /* Saves a new avatar seed string for a user */
  saveAvatar: (req, res) => {
    db.User.findById(req.params.id, (_err, user) => {
      if (user) {
        const userAvatar = req.body.avatar;
        db.User.findOneAndUpdate({ _id: user.id }, { avatar: userAvatar }, { new: true })
          .then((updatedUser) => {
            req.user = updatedUser;
            res.status(200).end();
          }
          );
      } else {
        res.status(404).end();
      }
    });
  },
  /*  Local access method */
  localAccess: id => {
    return db.User.findOne({ _id: id }, (_err, match) => {
      return match;
    })
      .catch(err => console.log(err));
  }
};
