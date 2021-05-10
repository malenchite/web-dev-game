const router = require('express').Router();
const cardController = require('../controllers/cardController');
const questionController = require('../controllers/questionController');
const userController = require('../controllers/userController');

router.route('/cards/:id')
  .get(cardController.getCard);

router.route('/questions/:id')
  .get(questionController.getQuestion);

/* Returns all question data  */
router.route('/questions/complete/:id')
  .get(questionController.getCompleteQuestion);

router.route('/users/gamehistory/:id')
  .get(userController.getGameHistory)
  .post(userController.saveGameHistory);

router.route('/users/avatar/:id')
  .post(userController.saveAvatar);
module.exports = router;
