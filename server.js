const express = require('express');
const http = require('http');
const socket = require('./services/socket');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const dbConnection = require('./db');
const passport = require('./passport');
const reactRoutes = require('./routes/reactRoutes');
const apiRoutes = require('./routes/apiRoutes');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');

const gameService = require('./services/gameService');
const userService = require('./services/userService');

const PORT = process.env.PORT || 3001;

const corsConfig = process.env.REACT_APP_DEPLOYED
  ? {}
  : {
    origin: 'http://localhost:3000',
    credentials: true
  };

/* Create server objects */
const app = express();

/* Middleware */
app.use(cors(corsConfig));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: process.env.APP_SECRET || 'this is the default passphrase',
  store: new MongoStore({ mongooseConnection: dbConnection }),
  resave: false,
  saveUninitialized: false
}));

/* Passport initialization */
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

/* Production assets and routes */
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.use(reactRoutes);
}

const server = http.createServer(app);

/* Start up socket.io */
const io = socket(server);

/* Initialize services */
userService(io);
gameService.initialize(io);

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
