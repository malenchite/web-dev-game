const db = require('../models');

module.exports = {
  /* API access methods */
  /* Gets the text for a specific question */
  getQuestion: (req, res) => {
    db.Question.findById(req.params.id, (_err, question) => {
      if (question) {
        res.json(question.text);
      } else {
        res.status(404).end();
      }
    })
      .catch(err => console.log(err));
  },
  /* Returns the entire question object */
  getCompleteQuestion: (req, res) => {
    db.Question.findById(req.params.id, (_err, question) => {
      if (question) {
        res.json(question);
      } else {
        res.status(404).end();
      }
    })
      .catch(err => console.log(err));
  },
  /* Local access methods */

  /* Get a list of all questions with category and subcategory */
  localList: (category) => {
    return db.Question.find({ category }, 'id category subcategory', (_err, list) => {
      return list;
    })
      .catch(err => console.log(err));
  }
};
