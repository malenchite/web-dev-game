const router = require('express').Router();
const cardController = require('../controllers/cardController');
const questionController = require('../controllers/questionController');
const userController = require('../controllers/userController');

/* Returns data for a specific card */
router.route('/cards/:id')
  .get(cardController.getCard);

/* Returns only the question text for a specific question */
router.route('/questions/:id')
  .get(questionController.getQuestion);

/* Returns all question data for a specific question */
router.route('/questions/complete/:id')
  .get(questionController.getCompleteQuestion);

/* Returns entire game history for a specific user */
router.route('/users/gamehistory/:id')
  .get(userController.getGameHistory)
  .post(userController.saveGameHistory);

/* Returns the avatar seed string for a specific user */
router.route('/users/avatar/:id')
  .post(userController.saveAvatar);

module.exports = router;
