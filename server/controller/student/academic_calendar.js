require('../../database/database');
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const express = require('express');
const { format, eachDayOfInterval } = require("date-fns");
var db = mongoose.connection;


const class_model = require("../../models/admin/section_model");
const student_model = require("../../models/admin/student_model");
const assign_model=require("../../models/assignment/assignment_model");
const staff_model = require("../../models/admin/staff_information_model");

// this is to find no of notifications added by purushothaman @ 29/2 7.34 am
const {noOfNotificationsForStudents} = require('../universal_controller/notificationFunction')
//-----------------------------------------------------------------------------

// Body-Parser
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

exports.academic_calendar = async (req, res) => {
    // db.collection("academic_calendar")
    //   .findOne({})
    //   .then((data) => {
    //     // console.log(data);
    const {id,title,sec,}=req.params;
    const role=req.originalUrl.toString().split('/')[1];
    const selected = mongoose.model(title);
    const student= await selected.findOne({rollno:id});
    // this is to find no of notifications added by purushothaman @ 29/2 7.34 am
    let notification = await noOfNotificationsForStudents(student.rollno,student.id)
        res.render("student/academic_calendar",{notification,role,student});
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
  