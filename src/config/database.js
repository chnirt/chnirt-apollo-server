const mongoose = require("mongoose");
// mongoose.Promise = global.Promise;

const url = process.env.MONGO_URI;

mongoose.connect(url, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true
});

mongoose.connection.once("open", () =>
  console.log(`☁️ Connected successfully to server`)
);
