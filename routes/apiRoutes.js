const router = require('express').Router();
const cardController = require('../controllers/cardController');
const questionController = require('../controllers/questionController');

router.route('/cards/:id')
  .get(cardController.getCard);

router.route('/questions/:id')
  .get(questionController.getQuestion);

/* Returns all question data  */
router.route('/questions/complete/:id')
  .get(questionController.getCompleteQuestion);
module.exports = router;
