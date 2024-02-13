require('../../database/database');
const { connect } = require('mongoose');
const bodyParser = require('body-parser');
const express = require('express');
const session = require("express-session");

const student_model = require("../../models/admin/student_model");
const class_model = require("../../models/admin/section_model");
const mongoose=require('mongoose');

// Body-Parser
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

const dayhour={
    'day':6,
    'hr':5
}


exports.student_index = async (req, res) => { 
    const id=req.params.id;
    const cls=req.params.class;
    var [title,batch,sec]=cls.split('_');

    title+='_'+batch;

    

    const selected = mongoose.model(title);
    var student=await selected.findOne({rollno:id});
    req.session.obj_id= student._id.toString();
    console.log(student);
    res.render('student_index',{student});
};

// Time table 

exports.time_table=async (req,res)=>{
   const {id,title,sec}=req.params;
   const role=req.originalUrl.toString().split('/')[1]
   const selected =mongoose.model(title);
   const dummy=req.dummy;
   
  const student=await selected.findOne({rollno:id});
  const time_table=await class_model.findOne({id:title,section_name:sec},{time_table:1})

  res.render('student/time_table',{student,time_table,dayhour,role})

}
