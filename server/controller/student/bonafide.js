
require('../../database/database');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const express = require('express');
const { format, eachDayOfInterval } = require("date-fns");
var db = mongoose.connection;




//--------------------model here----------------------------
const bonafide = require('../../models/admin/bonafide_models');
const Student = require('../../models/admin/student_model');
const commoninfo=require('../../models/admin/common_info_model');

const class_list=require('../../models/admin/section_model');
const { log } = require('util');

var db = mongoose.connection;

// Body-Parser
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

exports.bono = async (req,res)=>{
  const {id,title,sec}=req.params;
   const role=req.originalUrl.toString().split('/')[1]
   const selected =mongoose.model(title);
   const student=await selected.findOne({rollno:id});
   var bonafide_data=await bonafide.find({id:id})
   
  
  
    // res.render('student/bonafide',{role,student,bonafide_data}); 
    res.render('student/bonafide', { role, student, bonafide_data });  
}

exports.bonafids = async (req, res) => {
  try {
    const { id, title,sec } = req.params;
    const role = req.originalUrl.toString().split('/')[1];
    const bonafide_title = req.body.bonafide_title;
    const bonafide_des = req.body.bonafide_des;

    const newBonafidepost = new bonafide({
      id,
      class:title,
      section:sec,
      bonafide_title: bonafide_title,
      bonafide_des: bonafide_des,
      approval:false
    });

 var ackn=   await newBonafidepost.save();
    // student.bonafides.push(newBonafidepost); // Assuming there's a 'bonafides' field in your student schema

   res.redirect(`/student/bonafide/${id}/${title}/${sec}`)
  } catch (error) {
    console.error(error);
  }   
}
exports.certificate=async (req,res)=>{
  const { id, title,sec } = req.params;
  const role=req.originalUrl.toString().split('/')[1]
     const selected =mongoose.model(title);
  const student=await selected.findOne({rollno:id});
  
    console.log("student:",student);

  const common=await commoninfo.find({},{_id:0,school_name:1});
  console.log("common info:",common);
  console.log("selected:",id,title,sec);

 const section=await class_list.find({},{section_name:1});
 
  var bonafide_data=await bonafide.find({id:id,approval:true});
  console.log(bonafide_data);
  res.render('./student/bonafide_certificate',{ role, student,bonafide_data ,common,section});


}
exports.pdf=async (req,res)=>{
  const { id, title,sec } = req.params;
  const role=req.originalUrl.toString().split('/')[1]
     const selected =mongoose.model(title);
  const student=await selected.findOne({rollno:id});
  var bonafide_data=await bonafide.find({id:id})
    console.log("student:",student)
    res.redirect('./student/bonafide_certificate',{ role, student,bonafide_data ,common,section});
    

}
