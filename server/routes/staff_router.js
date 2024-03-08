const express = require("express");
const router = express.Router();


const staff_controller = require('../controller/staff/staff_controller');
const staff_attendance = require('../controller/staff/attendance')
const staff_time_table = require('../controller/staff/time_table')
const staff_inbox=require('../controller/staff/staff_inbox')
const staff_instruction=require('../controller/staff/staff_instructions');
const validator=require("../controller/universal_controller/validator");
const assignment=require("../controller/staff/assignment");

const mark_entry_controller=require('../controller/marksheet/mark_entry_controller')


//--------------------  Navigation Routes  -------------------------------

//----------------------time table------------------------------------------
router.get("/staff/time_table/:id" ,staff_time_table.time_table);
router.get('/staff/message_seen/:id/:_id' ,staff_inbox.message_seen)
router.use('/staff/inbox/:id' ,staff_inbox.staff_inbox)

router.use('/staff/deleteInstructions/:id/:staffId' ,staff_instruction.deleteInstruction)
router.use('/staff/instructions/:id' ,staff_instruction.instruction)
router.use('/staff/instructions_send/:id' ,staff_instruction.instruction_send)

//----------------------Attendance------------------------------------------
router.get("/staff/attendance/:id/:date" , staff_attendance.attendance);
router.get("/staff/attendance_link/:id/:date/:order/:hour/:std/:sec" ,staff_attendance.attendance_link);
router.post("/staff/attendance_submit/:id/:date/:order/:hour/:std/:sec" , staff_attendance.attendance_submit);


//----------------------Assignment------------------------------------------
router.get("/staff/assignment/:id/", assignment.assignment);
router.get("/staff/assignment_list/:id/:class/:sec/:sub", assignment.assignment_list);
router.post("/staff/new_assignment/:id/:class/:sec/:sub",assignment.new_assignment);
router.get("/staff/assignment/viewlist/:id/:class/:sec/:assign_id",assignment.viewlist);

//-------------------mark entry and marksheet generation---------------------------

router.get('/staff/markentry/:id',mark_entry_controller.mark_entry_index)
router.get('/staff/markentry/viewclass/:_id/:batch',mark_entry_controller.mark_entry)
router.post('/staff/markentry/:_id/:batch/markentered',mark_entry_controller.mark_entered)



module.exports = router;
