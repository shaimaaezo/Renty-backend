const mongoose = require("mongoose");
const dotenv = require("dotenv");

const connectionOptions = {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};

dotenv.config();

mongoose
  .connect(process.env.CONNECTION_URL, connectionOptions)
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((e) => {
    console.error("Connection error", e.message);
  });

const db = mongoose.connection;
module.exports = db;
