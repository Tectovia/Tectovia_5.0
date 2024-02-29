const express = require('express');
const router = express.Router();


const student_controller = require('../controller/student/student_controller');
const student_attendance= require('../controller/student/attendance');
const student_assignment= require('../controller/student/assignment');
const student_dairy=require('../controller/student/digital_dairy')
const student_marksheet=require("../controller/student/student_marksheet")
const student_fees=require("../controller/student/student_fees")

const validator=require("../controller/universal_controller/validator");



//------------------------------  student  -------------------------------------
// router.get('/student_index',validator.validator,student_controller.student_index);
router.get('/student/time_table/:id/:title/:sec',validator.validator,student_controller.time_table);
router.get('/student/attendance/:id/:title/:sec/:req_date',validator.validator,student_attendance.attendance);
router.get('/student/dairy/:id/:title/:sec',validator.validator,student_dairy.student_dairy);
router.get('/student/assignment/:id/:title/:sec/',student_assignment.assignment);
router.get('/student/assignment_write/:id/:title/:sec/:assign_id',student_assignment.assignment_write);
router.post('/student/assignment_submission/:id/:title/:sec/:assign_id',student_assignment.assignment_submission);
router.get('/student/dairy/:id/:title/:sec',student_dairy.student_dairy);
router.get('/student/circular/:id/:title',student_dairy.student_circular);
router.get('/student/testmarks/:id/:stdclass/:sec',student_marksheet.student_marksheet);
router.get('/student/fees/:id/:title/:sec', student_fees.fees);

module.exports = router;
