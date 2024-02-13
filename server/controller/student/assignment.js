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
    const selected = mongoose.model( title);
    const role=req.originalUrl.toString().split('/')[1]
   const student=await selected.findOne({ rollno: id },{rollno:1,assignment:1,id:1,section:1}).populate('assignment.ref_id')
   console.log(student.assignment);
  res.render('student/assignment',{student,role}); 
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
  console.log("title: "+title);

  try {
    const {id,title,sec,assign_id}=req.params;
    const selected = mongoose.model(title)
    const student= await selected.findOne({rollno:id});
    let assign;
    
   await  student.assignment.forEach((item) => {
        if(item.ref_id.toString()===assign_id){
            assign=item._id;
           item.source=req.body.source;
        };
     
       });
   
    const result=await selected.updateOne({rollno:id},student);
    console.log(result);
 
    
    res.redirect(`/student/assignment/${id}/${title}/${sec}`);
  } catch (error) {
    
  }
}
async function test(){

  const test=await assign_model.findOne().populate('attachment.ref_id','assignment')
  console.log(test.attachment[0].ref_id);
}
// test()
