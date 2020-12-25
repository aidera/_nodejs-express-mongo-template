const mongoose = require("mongoose");
const config = require("config");

exports.startDB = (callback) => {
  mongoose.connect(config.get("databaseURI"), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
    .then(() => {
      callback();
    })
    .catch(err => {
      console.log("MongoDB connection failed");
      console.log(err);
    });
}

