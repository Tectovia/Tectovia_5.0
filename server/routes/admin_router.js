const express = require('express');
const router = express.Router();

// ---------------------validator router-------------------------------------------
const validator=require('../controller/universal_controller/validator');
//--------------------  institution_info_controllers  -------------------------------
const admin_common_info = require('../controller/admin/institution_info/common_info');
const admin_higher_authority = require('../controller/admin/institution_info/higher_authority');
const admin_achievement = require('../controller/admin/institution_info/achievements');
const admin_annual_report = require('../controller/admin/institution_info/annual');
const admin_others = require('../controller/admin/institution_info/others');

//--------------------  staff_info_controllers  -------------------------------
const admin_staff_list = require('../controller/admin/staff_info/staff_info');

//--------------------  Class_info_controllers  ---------------------------------
const admin_class_list = require('../controller/admin/class_info/class_list');
const admin_class = require('../controller/admin/class_info/class');
const admin_section = require('../controller/admin/class_info/section');
const view_student = require('../controller/admin/class_info/view_student');
const admin_timetable=require('../controller/admin/class_info/time_table');

//--------------------  circular_controller  ---------------------------------

const circular_management=require('../controller/admin/circular/circular');

//--------------------  Infrastructure -------------------------------
const infrastructure=require('../controller/admin/infrastructure/infrastructure');

//--------------------  Facilities -------------------------------
const facilities=require('../controller/admin/facilities/facilities');

//--------------------  institution_info  -------------------------------


//--------------------  Academic calendar  -------------------------------

const academic=require('../controller/admin/academic_calender/academic_calender');

//--------------------  Attendance graph COntroller ---------------------------
const attendance_graph=require('../controller/admin/attendance_graph/attendance_graph');

// ----------------------Fees Controller----------------------------------
const fees_controller=require('../controller/fees_controller/fees')
//-----------------------Forum controller----------------------------------
const forum=require('../controller/admin/forum/forum')



    //----------- Common Info ----------------
    router.get('/admin/institution_info/common_info' ,admin_common_info.common_info);
    router.post('/admin/institution_info/common_info/submit_common_info' ,admin_common_info.submit_common_info);
    router.post('/admin/institution_info/common_info/update_common_info' ,admin_common_info.update_common_info);

    //Forum
    router.get('/admin/forum',validator.admin_validator,forum.forum)
    //---------- Higher authority -------------
    router.get('/admin/institution_info/higher_authority' ,admin_higher_authority.higher_authority);

        //form and submit
        router.post('/admin/institution_info/higher_authority/submit_higher_authority' ,admin_higher_authority.submit_higher_authority);
        router.post('/admin/institution_info/higher_authority/update_higher_authority/:id' ,admin_higher_authority.update_higher_authority);

        //edit and delete
        router.get('/admin/institution_info/higher_authority/form_higher_authority/edit/:id' ,admin_higher_authority.higher_authority_edit);
        router.get('/admin/institution_info/higher_authority/form_higher_authority/delete/:id' ,admin_higher_authority.higher_authority_delete);

    //---------- Achievements -------------
    router.get('/admin/institution_info/achievements' ,admin_achievement.achievements);
    router.get('/admin/institution_info/achievements/form_achievements' ,admin_achievement.form_achievements);
    router.post('/admin/institution_info/achievements/submit_achievements' ,admin_achievement.submit_achievements);


    //----------- Annual report -----------
    router.get('/admin/institution_info/annual_report' , admin_annual_report.annual_report);


    //------------ Others -----------------
    router.get('/admin/institution_info/others' , admin_others.others);



//--------------------  staff_info  -------------------------------
router.get('/admin/staff_info' , admin_staff_list.admin_staff_list);

    router.get('/admin/staff_info/add_staff' ,admin_staff_list.add_staff);
// ----------------------------Staff Forms-------------------------------
    router.post('/admin/staff_info/new_staff' ,admin_staff_list.new_staff);
    router.post('/staff_personal_details/:id' ,admin_staff_list.staff_personal);
    router.post('/staff_education_form/:id' ,admin_staff_list.staff_education);
    router.post('/staff_achivements_form/:id' ,admin_staff_list.staff_achivements);
    // -----------------------staff delete & view-------------------------------
    router.get('/admin/staff_info/staff_list/delete/:id' ,admin_staff_list.staff_delete);
    router.get('/admin/staff_info/staff_list/view/:id' ,admin_staff_list.staff_view);
// -------------------------------------staff personal data edit-----------------------------------
    router.get('/admin/staff_info/staff_list/personal_edit/:id' ,admin_staff_list.staff_personal_edit);
    router.post('/admin/staff_info/staff_list/personal_edit_submission/:id' ,admin_staff_list.personal_edit_submission);
    // -------------------------------------staff education data edit-----------------------------------
    router.get('/admin/staff_info/staff_list/education_edit/:id' ,admin_staff_list.staff_education_edit);
    router.post('/admin/staff_info/staff_list/education_edit_submission/:id' ,admin_staff_list.education_edit_submission);
// -----------------------------------------staff achievement data edit
router.get('/admin/staff_info/staff_list/achievement_edit/:id' ,admin_staff_list.staff_achievement_edit);
//-------------------------------------------view Document------------------------------
router.get('/admin/staff_info/staff_list/view_document/:id' ,admin_staff_list.staff_document_view);
    


//--------------------  class_info  -------------------------------

    //----------- Class List ----------------
    router.get('/admin/class_info/class_list', admin_class_list.class_list);
    router.get('/admin/class_info/class_list/:title', admin_class_list.classes);
    

    //section
        router.post('/admin/class_info/class_list/submit_section/:title', admin_class.submit_section);

    //subject
        router.post('/admin/class_info/class_list/submit_subject/:title', admin_class.submit_subject);
    //Fees
        
        router.post('/admin/class_info/class_list/submit_fees/:title',fees_controller.fees)
        router.post('/admin/class_info/class_list/submit_update_fees/:title',fees_controller.updatefees)

    //view section and subject
    router.get('/admin/class_info/class_list/view_section/:id/:title/:section/' ,admin_class.view_section);
    router.get('/admin/class_info/class_list/view_subject/:id/:title', admin_class.view_subject);
    
    //delete section and subject
    router.get('/admin/class_info/class_list/delete_section/:id/:title/:section', admin_class.delete_section);
    router.get('/admin/class_info/class_list/delete_subject/:id/:title', admin_class.delete_subject);

    //Add student
    router.post('/admin/class_info/class_list/view_section/submit_student_basic/:id/:title/:section', admin_section.submit_student_basic);
    router.post('/admin/class_info/class_list/view_section/submit_student_details/:stu_id/:title/:sec_id/:section', admin_section.submit_student_details);
    router.post('/admin/class_info/class_list/view_section/submit_student_parent/:stu_id/:title/:sec_id/:section', admin_section.submit_student_parent);
    router.get('/view_section/add_student/:id/:title/:section/:prop/:current', admin_class.after_submission)
    //Edit Section
    router.post('/admin/class_info/class_list/view_section/edit_section/:_id/:title/:section', admin_section.edit_section);

    //View student
    router.get('/admin/class_info/class_list/view_section/view_student/:_id/:title/:section' , admin_section.view_student);
    
    //Delete student
    router.get('/admin/class_info/class_list/view_section/delete_student/:_id/:_sec_id/:title/:section' , admin_section.delete_student);


    //close form
    router.get('/admin/class_info/class_list/close_form/:title' , admin_class.close_form);

    //goback to class
    router.get('/admin/class_info/class_list/:title' , admin_class.go_back_class);

    //goback to section
    router.get('/admin/class_info/class_list/:_id/:title/section' , admin_class.go_back_section);


//--------------------  Infrastructure  -------------------------------
    router.get('/admin/infrastructure' , infrastructure.view_infrastructure);


//--------------------  Facilities  -------------------------------
    router.get('/admin/facilities/hostel' , facilities.hostel);
    router.get('/admin/facilities/transport' , facilities.transport);
    router.get('/admin/facilities/lab' , facilities.lab);
    router.get('/admin/facilities/library' , facilities.library);
    router.get('/admin/facilities/coaching' , facilities.coaching);

// -----------------------------time table------------------------
    router.get('/admin/class_info/class_list/view_section/time_table/:id/:title/:section' ,admin_timetable.timetable);
    // ----------------------------Add-time Table Form----------------------------------------------------
    router.get('/admin/class_info/class_list/view_section/add_form/:id/:title/:section/:day/:hr' ,admin_timetable.add_form);
    // -----------------------------Submit Table from-----------------------------------------------------
    router.post('/admin/class_info/class_list/view_section/form_sub/:id/:title/:section/:day/:hr' ,admin_timetable.form_sub);
    // ---------------------------------------Remove Data of Specific day--------------------------------
    router.get('/admin/class_info/class_list/view_section/delete_day/:id/:title/:section/:day/:hr/:sub/:staff/:staff_id' ,admin_timetable.delete_day);
// -------------------- Academic info  -------------------------------
    router.get('/admin/academic_calendar' ,academic.academic_calendar);
    router.post('/admin/academic_calendar/event/:date' ,academic.add_event);

//--------------------  parent_info  -------------------------------
// router.get('admin/parent_info', parent_info);

//--------------------  circular_management  -------------------------------
router.get('/admin/circular',circular_management.circular_management);
router.post('/admin/circular/message_sent',circular_management.message_sent) ;
router.get("/admin/circular/archive_circular/:_id",circular_management.message_archive)
router.get("/admin/circular/delete_circular/:_id",circular_management.message_delete)


//--------------------  attendance_graph  -------------------------------
router.get('/admin/attendance_graph/:date', attendance_graph.attendance_graph);

//--------------------  set_holidays  -------------------------------
// router.get('admin/set_holidays', admin_controller.set_holidays);


module.exports = router;
    
