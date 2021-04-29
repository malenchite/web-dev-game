const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
let MONGO_URL;
const MONGO_LOCAL_URL = 'mongodb://localhost/thewebdevgame';

/* Choose DB based on whether we are deployed or not */
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });
  MONGO_URL = process.env.MONGODB_URI;
} else {
  mongoose.connect(MONGO_LOCAL_URL, { useNewUrlParser: true }); // local mongo url
  MONGO_URL = MONGO_LOCAL_URL;
}

/* Open DB connection and respond to result */
const db = mongoose.connection;

db.on('error', err => {
  console.log(`There was an error connecting to the database: ${err}`);
});

db.once('open', () => {
  console.log(`You have successfully connected to your mongo database: ${MONGO_URL}`);
});

module.exports = db;
