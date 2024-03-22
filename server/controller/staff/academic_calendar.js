require("../../database/database");
const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");

// Models Here!
const staff_model = require("../../models/admin/staff_information_model");
const {noOfCirculars}=require('../universal_controller/notificationFunction');
var db = mongoose.connection;
// Body-Parser
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

exports.academic_calendar = async (req, res) => {
  // db.collection("academic_calendar")
  //   .findOne({})
  //   .then((data) => {
  //     // console.log(data);
  const id=req.params.id;
  const staffdata=await staff_model.find({_id:id},{})
  let circularNotification = await noOfCirculars(staffdata[0].staff_id);
   // used to show circular notification for staff edited by purushothaman @ 14/3
   circularNotification = circularNotification.unSeenCirculars
   //----------------------------------------------------------------------
      res.render("staff/academic_calendar",{circularNotification,staffdata});
    // });
};

// academic_year();

// function academic_year() {
//   // Create an object to represent the academic calendar

//   // Define the year for the academic calendar
//   const year = 2024; // Replace with the desired year

//   // Generate an array of dates for the entire year
//   const startDate = new Date(year, 0, 1); // January 1st
//   const endDate = new Date(year, 11, 31); // December 31st
//   const allDates = eachDayOfInterval({ start: startDate, end: endDate });

//   // Define an array of day names
//   const dayNames = [
//     "Sunday",
//     "Monday",
//     "Tuesday",
//     "Wednesday",
//     "Thursday",
//     "Friday",
//     "Saturday",
//   ];

//   // Create the academic calendar object
//   const academicCalendar = { year: year };

//   var k = 1;
//   var z;

//   var vals = "w";
//   // Loop through the dates and populate the academic calendar
//   allDates.forEach((date, index) => {
//     const formattedDate = format(date, "dd-MM-yyyy");
//     const dayOfWeek = dayNames[date.getDay()];
//     if (dayOfWeek == "Sunday" || dayOfWeek == "Saturday") {
//       vals = "holiday";
//     } else {
//       vals = "working day";
//     }
//     if (k == 7) {
//       k = 1;
//     }
//     z = k;
//     if (vals == "holiday") {
//       k = "null";
//     }
//     academicCalendar[formattedDate] = {
//       dayOfWeek: dayOfWeek,
//       status: vals,
//       dayorder: k,
//       desc: "null",
//     };
//     if (k == "null") {
//       k = z;
//     }

//     k = k + 1;
//     if (vals == "holiday") {
//       k = k - 1;
//     }
//   });

//   console.log(academicCalendar);
//   db.collection("academic_calendar").insertOne(academicCalendar);
// }
