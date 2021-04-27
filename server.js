const express = require('express');
const http = require('http');
const socket = require('./services/socket');
const reactRoutes = require('./routes/reactRoutes');
const apiRoutes = require('./routes/apiRoutes');

const PORT = process.env.PORT || 3001;

/* Create server objects */
const app = express();

/* Middleware */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/* Production assets and routes */
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.use(reactRoutes);
}

app.use(apiRoutes);

const server = http.createServer(app);

/* Socket behavior */
socket(server);

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
