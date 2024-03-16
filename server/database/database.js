require("dotenv").config();
const mongoose = require("mongoose");
mongoose.connect(process.env.LOCALDBURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;


mongoose.set("strictQuery", false);
db.on("error", console.error.bind(console, "connection error:"));-``  
db.once("open", function () {
  console.log("Connected");
});


