require("../../database/database");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const express = require("express");
const schedule = require("node-schedule");
const { format, eachDayOfInterval } = require("date-fns");
const fast2sms = require('fast-two-sms');

const staff_model = require("../../models/admin/staff_information_model");
const class_model = require("../../models/admin/section_model");
const subject_model = require("../../models/admin/subject_model");
const student_model = require("../../models/admin/student_model");
const assign_model = require("../../models/assignment/assignment_model");
const forum_model=require("../../models/admin/forum_model");
const { log } = require("util");

var db = mongoose.connection;
// Body-Parser
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

// exports.add_forum = async (req, res) => {
//     try { 
//         const { id } = req.params; 
//         const staffdata = await staff_model.find({_id:id});
//         const classmodel = await class_model.findOne({'section_incharge_id':staffdata[0].staff_id});
//         const forummodel = await forum_model.find();
//         let forumDetails = null;

//         for(i=0;i<forummodel.length;i++){
//             for(j=0;j<forummodel[i].forum_incharge.length;j++){
//                 let dummy = forummodel[i].forum_incharge[j];
//                 console.log(dummy);
//                 if(Object.keys(forummodel[i].forum_incharge[j]).includes(staffdata[0].staff_id)){
//                 forumDetails = {
//                 forum_title: forummodel[i].forum_title,
//                 forum_class: forummodel[i].forum_class,
//                 total: forummodel[i].total
//                 }
//                 }
//                 }
// }

exports.add_forum = async (req, res) => {
    try { 
        const { id } = req.params; 
        const staffdata = await staff_model.find({_id:id}); 
        const classmodel = await class_model.findOne({'section_incharge_id': staffdata[0].staff_id});
        const forummodel = await forum_model.findOne({'forum_incharge.staff_id': staffdata[0].staff_id});

        let forumDetails = null;
        if (forummodel) {
            forumDetails = {
                forum_title: forummodel.forum_title,
                forum_class: forummodel.forum_class,
                total: forummodel.total
            };
        } else {
            console.error("Forum data not found for the staff");
        }

        let classInchargeDetails = null;
        if (!classmodel) {
            console.error("Class data not found for the staff");
        } else if (classmodel.section_incharge_id === staffdata[0].staff_id) {
            classInchargeDetails = {
                classname: classmodel.id,
                sectioname: classmodel.section_name,
                sectioninchargeid: classmodel.section_incharge_id,
                sectioninchargename: classmodel.section_incharge_name,
                roomnumber: classmodel.room_number
            };
        } else {
            console.error("Staff is not in charge of any section");
        }

        res.render('./staff/forum_classes', { staffdata, classInchargeDetails, forumDetails });
    } catch (error) {
        console.error("Error occurred:", error);
        res.send("Internal Server Error");
    }
}


