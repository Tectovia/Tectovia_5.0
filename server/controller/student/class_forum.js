const db=require('../../database/database');
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require("bcrypt");

// Models Here!

const class_model = require('../../models/admin/section_model');
const login_data = require('../../models/login_data/login_info_model');
const staff_model = require("../../models/admin/staff_information_model");
const { date } = require('date-fns/locale');
const class_fees = require('../../models/admin/fees_models');
const {classes_map}=require('../../controller/universal_controller/class_map')
const {noOfNotificationsForStudents} = require('../universal_controller/notificationFunction')

// Body-Parser
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
const dayhour=JSON.parse(process.env.DAYHOUR);

// exports.classforum=async(req,res)=>{
//     const title =req.params.title;
//     const role=req.originalUrl.toString().split('/')[1]
//     const id=req.params.id;
//     var name=title.split('_')[0];
//     name= await classes_map[name];
//     const staffdetails=await staff_model.find();
    
//     const models=mongoose.model(title);
//     var student=await models.findOne({rollno:id});
//     console.log("student",student.id);
//     console.log("staff",staffdetails.class_incharge);
//     l
//     if(staffdetails.class_incharge===student.id){
//       var classinchargename=staffdetails.staff_name
//       console.log("classinchargename",classinchargename);
//     }
    
//     res.render('student/class_forum',{student,role,classinchargename});

// }
exports.classforum=async(req,res)=>{
  const title =req.params.title;
  const role=req.originalUrl.toString().split('/')[1]
  const id=req.params.id;
  var name=title.split('_')[0];

  name= await classes_map[name];

  const models=mongoose.model(title);
  var student=await models.findOne({rollno:id});
  let notification = await noOfNotificationsForStudents(student.rollno,student.id)
  console.log("student",student.forum);
  const staffDetails=await staff_model.find({},{class_incharge:1,staff_name:1,forum_incharge:1});
  
  //console.log("staff",staffDetails);
  res.render('student/class_forum',{student,role,staffDetails,notification});

}