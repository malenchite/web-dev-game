const router = require('express').Router();
const cardController = require('../controllers/cardController');

router.route('/cards/:id')
  .get(cardController.getCard);

module.exports = router;
