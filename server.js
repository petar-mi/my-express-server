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
const io = socketIo(server); // da nismo koristili namespace (nsp), ovde bi bilo global.io kako bi bilo dostupno i u modulu user
global.nsp = io.of('/my-namespace'); // umesto const nsp pisemo global kako bi bilo dostupno i u modulu user

const test = require('./routes/test');
const checkUser = require('./routes/checkUser');
const feed = require('./routes/feed');
const user = require('./routes/user');
app.use('/test', test);
app.use('/checkUser', checkUser);
app.use('/feed', feed);
app.use('/user', user);


//mongoose.connect('mongodb://localhost:27017/tweetsDB', { useNewUrlParser: true })
mongoose.connect('mongodb://psmokvic:novasifra1@ds052978.mlab.com:52978/tweets_db', { useNewUrlParser: true }) // psmokvic i novasifra1 kreirani su kao User na sajtu mLab-a i treba ih ubaciti u connection string
  .then(() => console.log("Connected to MongoDB..."))
  .catch(err => console.error('Could not connect to MongoDB...', err));

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => console.log(`my-server listening on port ${PORT}!`));


