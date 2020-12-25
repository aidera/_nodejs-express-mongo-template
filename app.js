const express = require("express");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const config = require("config");

const router = require("./routes/router");
const errorHandler = require("./services/error-handler");
const database = require("./utils/database");


const app = express();

app.use(helmet());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(bodyParser.urlencoded({extended: false}));

router(app);
errorHandler.set(app);

database.startDB(() => {
  const server = app.listen(config.get("port"));
  const io = require('./utils/socket').init(server);

  io.on('connection', socket => {
    console.log('Client connected');
  })
});
