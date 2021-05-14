const express = require('express');
const router = express.Router();
const passport = require('../passport');
const userController = require('../controllers/userController');

/* Sends the user data for the logged in user */
router.get('/user', userController.getUser);

/* Checks user authentication info and logs in */
router.post('/login', userController.auth, passport.authenticate('local'), userController.authenticate);

/* Logs the current user out */
router.post('/logout', userController.logout);

/* Adds a new user to the database */
router.post('/signup', userController.register);

module.exports = router;
