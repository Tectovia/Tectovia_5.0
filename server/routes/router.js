const express = require('express');
const router = express.Router();

const universal_controller = require('../controller/universal_controller/universal_controller');

const dummy = require('../controller/universal_controller/notificationFunction')

const admin_controller = require('../controller/admin/admin_controller')
const staff_controller = require('../controller/staff/staff_controller')
const student_controller = require('../controller/student/student_controller')
const parent_controller = require('../controller/parent/parent_controller');
const validator=require('../controller/universal_controller/validator');
const {studentNotification,dummy1} = require('../controller/student/notificationontroller')
//------------------------------------------------------------------------------------

// universal
router.get('/',universal_controller.uni_index);
router.get('/login_page',universal_controller.login_page);
router.post('/login_submission',universal_controller.login_submission);
router.get('/logout',universal_controller.logout_session);
router.get('/admission',universal_controller.admission);
// Indexs
router.get('/admin_index/',admin_controller.admin_index);
router.get('/staff_index/:id',staff_controller.staff_index);
router.get('/student_index/:id/:class',student_controller.student_index);
router.get('/parent_index/:id/:class',parent_controller.parent_index);

module.exports = router;

