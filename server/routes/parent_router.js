const express = require('express');
const router = express.Router();


const parent_controller = require('../controller/parent/parent_controller');
const student_dairy_contoller=require('../controller/student/digital_dairy');
const student_controller=require('../controller/student/student_controller');
//---------------------attendence parent----------------
const student_attendance= require('../controller/student/attendance');
//------------assignment parent------------------
const student_assignment= require('../controller/student/assignment');



//-------------------------------  parent  -------------------------------------
router.get("/parent_index/:id/:cls",parent_controller.parent_index);
router.get('/parent/time_table/:id/:title/:sec',student_controller.time_table);
router.get("/parent/dairy/:id/:title/:sec",student_dairy_contoller.student_dairy);

//---------------------attendence parent----------------
router.get('/parent/attendance/:id/:title/:sec/:req_date',student_attendance.attendance);
//------------assignment parent--------------------------
router.get('/parent/assignment/:id/:title/:sec/',student_assignment.assignment);

//-----------------------------parent circular------------------------------
router.get('/parent/circular/:id/:title',student_dairy_contoller.student_circular)

module.exports = router;