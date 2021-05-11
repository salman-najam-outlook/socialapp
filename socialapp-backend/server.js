const express = require("express");
const mongoose = require("mongoose");
const cookieparser = require("cookie-parser");
const cors = require('cors');
// const logger = require("morgan");

const app = express();

const dbConfig = require("./config/secrets");

// To return data in Json format
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieparser());
app.use(cors());
// app.use(logger('dev'));

const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET', 'POST', 'DELETE', 'PUT', 'OPTIONS');
  res.header('Access-Control-Allow-Headers',
  'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://localhost/socialapp', { useNewUrlParser: true, useUnifiedTopology: true });
// OR
mongoose.connect(dbConfig.url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

require('./socket/streams')(io);
require('./socket/private')(io);

// Adding Middleware Routes
const auth = require("./routes/authRoutes");
const posts = require("./routes/postRoutes");
const people = require("./routes/peopleRoutes");
const friends = require("./routes/friendsRoutes");
const message = require("./routes/messageRoutes");

app.use("/api/socialapp", auth);
app.use("/api/socialapp", posts);
app.use("/api/socialapp", people);
app.use("/api/socialapp", friends);
app.use("/api/socialapp", message);

// Defining port 3000 to listen to backend api
server.listen(3000, () => {
  console.log("Running at port 3000");
});
