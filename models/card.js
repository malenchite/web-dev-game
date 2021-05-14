const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.promise = Promise;

const effectSchema = new Schema({
  funding: { type: Number, unique: false, required: true },
  fep: { type: Number, unique: false, required: true },
  bep: { type: Number, unique: false, required: true },
  bugs: { type: Number, unique: false, required: true },
  special: { type: String, unique: false, required: false }
});

const cardSchema = new Schema({
  category: { type: String, unique: false, required: true },
  subcategory: { type: String, unique: false, required: false },
  title: { type: String, unique: false, required: true },
  text: { type: String, unique: false, required: true },
  success: effectSchema,
  failure: effectSchema
});

// Create reference to Card & export
const Card = mongoose.model('Card', cardSchema);
module.exports = Card;
