const mongoose = require('mongoose');
const { getDate, getMonth, getYear, getTime } = require('date-fns');
const {classes_map} =require("../../universal_controller/class_map")

exports.attendance_graph = async (req, res) => {
    if(req.params.date=='today'){
    res.render("admin/attendance_graph");
    }
  };
  