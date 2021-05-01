const db = require('../models');

module.exports = {
  /* API access methods */
  /* Gets the information for a specific card */
  getCard: (req, res) => {
    db.Card.findById(req.params.id, (_err, card) => {
      if (card) {
        res.json(card);
      } else {
        res.status(404).end();
      }
    })
      .catch(err => console.log(err));
  },
  /* Local access methods */
  /* Gets information on a specific card */
  localCard: id => {
    return db.Card.findById(id, (_err, card) => {
      return card;
    })
      .catch(err => console.log(err));
  },
  /* Get a list of all card IDs with category and subcategory */
  localList: () => {
    return db.Card.find({}, 'id category subcategory', (_err, list) => {
      return list;
    })
      .catch(err => console.log(err));
  }
};
