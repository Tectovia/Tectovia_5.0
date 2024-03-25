require('../../database/database');
const { connect } = require('mongoose');
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');

// Models Here!
const common_info_model = require('../../models/admin/common_info_model');
const higher_authority_model = require('../../models/admin/higher_authority_model');

// Body-Parser
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

exports.admin_index = async (req, res) => {
if(req.session.id){
  

}

  common_info_model.find( function(err, docs) {
    if (err) {
        console.log(err);
        // Handle the error
      } else {
       
        // Render the ejs template and pass the data
        res.render('admin_index', { docs });
      }
  });
};

// exports.staff_index = async (req, res) => {
//   common_info_model.find( function(err, docs) {
//     if (err) {
//         console.log(err);
//         // Handle the error
//       } else {
//         console.log("Found the following documents:");
//         console.log(docs);
//         // Render the ejs template and pass the data
//         res.render('staff_index', { docs });
//       }
//   });
// };

// exports.student_index = async (req, res) => {
//   common_info_model.find( function(err, docs) {
//     if (err) {
//         console.log(err);
//         // Handle the error
//       } else {
//         console.log("Found the following documents:");
//         console.log(docs);
//         // Render the ejs template and pass the data
//         res.render('student_index', { docs });
//       }
//   });
// };

// exports.parent_index = async (req, res) => {
//   common_info_model.find( function(err, docs) {
//     if (err) {
//         console.log(err);
//         // Handle the error
//       } else {
//         console.log("Found the following documents:");
//         console.log(docs);
//         // Render the ejs template and pass the data
//         res.render('parent_index', { docs });
//       }
//   });
// };
    

//     exports.achivements = async (req, res) => {
//       res.render("admin/institution_info/achivements", {page_title: "Achivements"});
//     };
    

//     exports.annual_report = async (req, res) => {
//       res.render("admin/institution_info/annual_report", {page_title: "Annual Report"});
//     };
    

//     exports.others = async (req, res) => {
//       res.render("admin/institution_info/others", {page_title: "Others"});
//     };

// //department_info
// exports.department_info = async (req, res) => {
//   res.render("admin/department_info/departments");
// };


// //staff_info
// exports.staff_info = async (req, res) => {
//   res.render("admin/staff_info");
// };



// //student_info
// exports.student_info = async (req, res) => {
//   res.render("admin/student_info");
// };



// //Parent_info
// exports.parent_info = async (req, res) => {
//   res.render("admin/parent_info");
// };



// //circular_management
// exports.circular_management = async (req, res) => {
//   res.render("admin/circular_management");
// };



// //set_hollydays
// exports.set_holidays = async (req, res) => {
//   res.render("admin/set_holidays");
// };


// attendance_graph








