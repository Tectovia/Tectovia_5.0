require('../../database/database');
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const express = require('express');
const { format, eachDayOfInterval } = require("date-fns");
var db = mongoose.connection;

const staff_model = require("../../models/admin/staff_information_model");
const class_model = require("../../models/admin/section_model");
const subject_model = require("../../models/admin/subject_model");
const student_model = require("../../models/admin/student_model");

// Body-Parser
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

const dayhour={
    'day':6,
    'hr':5
}


exports.attendance= async (req,res)=>{
    const {id,title,sec,req_date}=req.params;
    const selected = mongoose.model(title)
    const name =title.toLowerCase().replace(" ", "_") + "_" +sec;
    const date = new Date();
    const role=req.originalUrl.toString().split('/')[1]
    
    const year = date.getFullYear();
    if (req_date == "today") {
      var datetext = format(date, "dd-MM-yyyy");
    } else {
      var datetext =req_date;
    }
   const student=await selected.findOne({rollno:id});
   const acad_data = await db.collection("academic_calendar").findOne({ year: year });
   const dayorder=acad_data[datetext].dayorder
   if (dayorder !='null') {
      const time_table=await class_model.findOne({id:title,section_name:sec},{time_table:1});
      const periods=time_table.time_table[`day${dayorder}`];
     
      const common=  await db.collection(`attend_${name}`).findOne({ [datetext]: { $exists: true } });
      
     const student_attend=common[datetext][id]
     const ack=common[datetext].ack
    console.log(dayorder);
     res.render('student/attendance',{student,student_attend,periods,dayorder,ack,datetext,role})
    } else {
      res.render('student/attendance',{student,dayorder,datetext,role})
    }
   
    
   }
     


    