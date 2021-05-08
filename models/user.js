const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
mongoose.promise = Promise;

const gamedataSchema = new Schema({
  result: { type: String, unique: false, required: true },
  frontEndCorrect: { type: Number, unique: false, required: true },
  frontEndTotal: { type: Number, unique: false, required: true },
  backEndCorrect: { type: Number, unique: false, required: true },
  backEndTotal: { type: Number, unique: false, required: true },
  timestamp: { type: Date, unique: false, required: true }
});

// Define userSchema
const userSchema = new Schema({
  username: { type: String, unique: false, required: false },
  email: { type: String, unique: false, required: false },
  password: { type: String, unique: false, required: false },
  gamehistory: [gamedataSchema]
});

// Define schema methods
userSchema.methods = {
  checkPassword: function (inputPassword) {
    return bcrypt.compareSync(inputPassword, this.password);
  },
  hashPassword: plainTextPassword => {
    return bcrypt.hashSync(plainTextPassword, 10);
  }
};

// Define hooks for pre-saving
userSchema.pre('save', function (next) {
  if (!this.password) {
    next();
  } else {
    this.password = this.hashPassword(this.password);
    next();
  }
});

// Create reference to User & export
const User = mongoose.model('User', userSchema);
module.exports = User;
