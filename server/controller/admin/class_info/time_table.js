require("../../../database/database");
const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");

// Models Here!
const class_model = require("../../../models/admin/section_model");
const subject_model = require("../../../models/admin/subject_model");
const student_model = require("../../../models/admin/student_model");
const staff_model = require("../../../models/admin/staff_information_model");

const {classes_map}=require('../../universal_controller/class_map')

// Body-Parser
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
const dayhour = {
  day: 6,
  hr: 5,
};
// --------------time table------------------------
exports.timetable = async (req, res) => {
  data = {
    title: req.params.title,
    sec: req.params.section,
    id: req.params.id,
  };
  class_model
    .find({ id: data.title, section_name: data.sec })
    .then((classdata) => {
      console.log(classdata);
      res.render("admin/class_info/time_table", {
        data,
        dayhour,
        classdata,
        form: "none",
      });
    });
};

// end


// ----------------------Add Button-------------------------

exports.add_form = async (req, res) => {
  data = {
    title: req.params.title,
    sec: req.params.section,
    id: req.params.id,
    spcf_day: req.params.day,
    spcf_hr: req.params.hr,
  };
  var name=data.title.split('_')[0];
  name=classes_map[name];

  var staffdata = await staff_model.find({
    [`time_table.day${data.spcf_day}.${data.spcf_hr}.sub`]: "null","available":true});

  var classdata = await class_model.find({
    id: data.title,
    section_name: data.sec,
  });
  console.log(classdata);
  const subdata = await subject_model.find({id:data.title});
  res.render("admin/class_info/time_table", {
    data,
    dayhour,
    staffdata,
    classdata,
    subdata,
    form: "display",
  });
};
// -------------------form Submission----------------------
exports.form_sub = async (req, res) => {
  var title = req.params.title;
  var sec = req.params.section;
  var id = req.params.id;
  var day = req.params.day;
  var hr = req.params.hr;
  var staff_data = req.body.staff;
  var subject_name = req.body.subject;
  var [staff_id, staff_name, staff_rno] = staff_data.split("|");

  class_model
    .findByIdAndUpdate(id, {
      $set: {
        [`time_table.day${day}.${hr}.sub`]: subject_name,
        [`time_table.day${day}.${hr}.staff_name`]: staff_name,
        [`time_table.day${day}.${hr}.staff_id`]: staff_rno,
      },
    })
    .then((x) => {
      console.log(x);
    });
  staff_model
    .findByIdAndUpdate(staff_id, {
      $set: {
        [`time_table.day${day}.${hr}.class`]: title,

        [`time_table.day${day}.${hr}.sub`]: subject_name,

        [`time_table.day${day}.${hr}.sec`]: sec,
      },
    })
    .then((data) => {
      res.redirect(
        `/admin/class_info/class_list/view_section/time_table/${id}/${title}/${sec}`
      );
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.delete_day = async (req, res) => {
  var title = req.params.title;
  var sec = req.params.section;
  var id = req.params.id;
  var day = req.params.day;
  var hr = req.params.hr;
  var staff_id = req.params.staff_id;
  var staff_name = req.params.staff;

  class_model
    .findByIdAndUpdate(id, {
      $set: {
        [`time_table.day${day}.${hr}.sub`]: "null",
        [`time_table.day${day}.${hr}.staff_name`]: "null",
        [`time_table.day${day}.${hr}.staff_id`]: "null",
      },
    })
    .then((x) => {
      console.log(x);
    });
  staff_model
    .findOneAndUpdate(
      { staff_name: staff_name, staff_id: staff_id },
      {
        $set: {
          [`time_table.day${day}.${hr}.class`]: "null",
          [`time_table.day${day}.${hr}.sub`]: "null",
          [`time_table.day${day}.${hr}.sec`]: "null",
        },
      }
    )
    .then((data) => {
      res.redirect(
        `/admin/class_info/class_list/view_section/time_table/${id}/${title}/${sec}`
      );
    })
    .catch((err) => {
      console.log(err);
    });
};
