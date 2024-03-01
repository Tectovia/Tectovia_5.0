const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const fileUpload = require("express-fileupload");
const flash = require("connect-flash");
var mongoose = require("mongoose");
const db = mongoose.connection;
var compression = require("compression");
require("dotenv").config();
const { format, eachDayOfInterval } = require("date-fns");
const session = require("express-session");


const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(expressLayouts);
app.use(compression());
app.use(flash());
app.use(fileUpload());

app.set("layout", "./layout/layout");
app.set('view engine', 'ejs');

app.set("trust proxy", 1);
app.use(
  session({
    secret: "hUcfGIXkFzcn7CkgmFyDwhRGkmMQpkGh",
    resave: false,
    saveUninitialized: true,
    maxAge: 3600000, // 1000 ms * 60 seconds * 60 minutes = 1 hour
  })
);

const universal_routes = require("./server/routes/router");
const admin_routes = require("./server/routes/admin_router");
const staff_routes = require("./server/routes/staff_router");
const student_routes = require("./server/routes/student_router");
const parent_routes = require("./server/routes/parent_router");


app.use(universal_routes);
app.use(admin_routes);
app.use(staff_routes);
app.use(student_routes);
app.use(parent_routes);

app.listen(port, () => console.log(`click here : http://localhost:${port}`));





app.get('/api/test',async(req,res)=>{
  var data=await db.collection('academic_calendar').findOne({year:2024});
  console.log(data);
  res.send(data);
 })