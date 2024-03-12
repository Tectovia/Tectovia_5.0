require("dotenv").config();
const mongoose = require("mongoose");
<<<<<<< Updated upstream
mongoose.connect(process.env.LOCALDBURL, {
=======
mongoose.connect(process.env.LOCAlDBURL, {
>>>>>>> Stashed changes
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;


mongoose.set("strictQuery", false);
db.on("error", console.error.bind(console, "connection error:"));-``  
db.once("open", function () {
  console.log("Connected");
});


