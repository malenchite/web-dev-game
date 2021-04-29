const express = require('express');
const http = require('http');
const socket = require('./services/socket');
const reactRoutes = require('./routes/reactRoutes');
const apiRoutes = require('./routes/apiRoutes');
const authRoutes = require('./routes/authRoutes');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const dbConnection = require('./db');
const passport = require('./passport');
const cors = require('cors');

const PORT = process.env.PORT || 3001;

const corsConfig = process.env.REACT_APP_DEPLOYED ? {} : { origin: '*' };

/* Create server objects */
const app = express();

/* Middleware */
app.use(cors(corsConfig));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: process.env.APP_SECRET || 'this is the default passphrase',
  store: new MongoDBStore({ mongooseConnection: dbConnection }),
  resave: false,
  saveUninitialized: false
}));

/* Passport initialization */
app.use(passport.initialize());
app.use(passport.session()); // will call the deserializeUser

/* Production assets and routes */
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.use(reactRoutes);
}

app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

const server = http.createServer(app);

/* Socket behavior */
socket(server);

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
