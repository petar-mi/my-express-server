const http = require('http');
const express = require('express');
var cors = require('cors');
const socketIo = require("socket.io");
const socketIndex = require("./routes/index");
const mongoose = require('mongoose');
const app = express();
app.use(express.json());
app.use(cors()); // enables CORS for all requests
app.use(socketIndex);
const server = http.createServer(app);
const io = socketIo(server); // if namespace(nsp) isn't used, we would define this as global.io for it to be available in user module as well
global.nsp = io.of('/my-namespace'); // instead of const nsp we are defining it as global.nsp for it to be available in user module as well

const test = require('./routes/test');
const test2 = require('./routes/test2');
const checkUser = require('./routes/checkUser');
const feed = require('./routes/feed');
const user = require('./routes/user');
app.use('/test', test);
app.use('/test2', test2);
app.use('/checkUser', checkUser);
app.use('/feed', feed);
app.use('/user', user);

let connectionString;
if (process.env.REACT_APP_MY_MACHINE && process.env.REACT_APP_MY_MACHINE === "zekan") {  
  connectionString = process.env.REACT_APP_DB_STRING;
  console.log('running on localserver');
} else {
  connectionString = process.env.DB_STRING_HEROKU;
}

mongoose.connect(connectionString, { useNewUrlParser: true })
  .then(() => console.log("Connected to MongoDB..."))
  .catch(err => console.error('Could not connect to MongoDB...', err));

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => console.log(`my-server listening on port ${PORT}!`));


