require('../../database/database');
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const express = require('express');
const { format, eachDayOfInterval } = require("date-fns");
var db = mongoose.connection;




const class_model = require("../../models/admin/section_model");
const student_model = require("../../models/admin/student_model");
const assign_model=require("../../models/assignment/assignment_model");

// Body-Parser
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

exports.assignment=async(req,res)=>{
    try {
    const {id,title,sec,}=req.params;
    
    const role=req.originalUrl.toString().split('/')[1];
   
    var assign_name=title.split('_')[0]+"_test";
    
    const selected = mongoose.model(title);
    const assign_model=mongoose.model(assign_name);
   const assign=await assign_model.findOne({ rollno: id },).populate('assignment.ref_id');
   const student= await selected.findOne({rollno:id},{id:1,name:1,rollno:1,section:1})
   console.log(assign);
   
  res.render('student/assignment',{student,role,assign}); 
    } catch (error) {
        console.log("At student Assignment",error);
    }
   
}
exports.assignment_write=async(req,res)=>{
  try {
    const {id,title,sec,assign_id}=req.params;
    const selected = mongoose.model(title)
    const student= await selected.findOne({rollno:id});
    res.render('student/assign_write',{student,assign_id}); 
} catch (error) {
    console.log("error from assignment");
  }
}


exports.assignment_submission=async (req,res)=>{
  const {id,title,sec,assign_id}=req.params;
 

  try {
    const {id,title,sec,assign_id}=req.params;
    var assign_name=title.split('_')[0]+"_assign";
    var test_name=title.split('_')[0]+"_test";
    const test_model=mongoose.model(test_name);
    const assign_model=mongoose.model(assign_name);

   var student=await test_model.findOne({rollno:id})
    
   await  student.assignment.forEach((item) => {
        if(item.ref_id.toString()===assign_id){
            
           item.status='done';
        };
     
       });
   
    const result=await test_model.updateOne({rollno:id},student,{new:true});
    var doc={};
    doc[id]=req.body.source
    console.log();
    const assign_result=await assign_model.findOneAndUpdate({_id:assign_id},{$push:{source:doc}} ,{new:true})
    console.log(assign_result);
    
    res.redirect(`/student/assignment/${id}/${title}/${sec}`);
  } catch (error) {
    console.log(error);
  }
}

