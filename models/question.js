const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.promise = Promise;

const questionSchema = new Schema({
  category: { type: String, unique: false, required: true },
  subcategory: { type: String, unique: false, required: false },
  text: { type: String, unique: false, required: true },
  answer: { type: String, unique: false, require: true }
});

// Create reference to Question & export
const Question = mongoose.model('Question', questionSchema);
module.exports = Question;
