require('../../database/database');
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const express = require('express');
const { format, eachDayOfInterval, parseISO,isValid} = require("date-fns");
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
const section_map={'A':0,'B':1,'C':2,'D':4,'E':5}
function isValidDate(dateString) {
  const parsedDate = parseISO(dateString);
  return isValid(parsedDate);
}
exports.attendance= async (req,res)=>{
    const {id,title,sec,req_date}=req.params;
    const selected = mongoose.model(title)
    const name =title.split('_')[0]+"_attendance"
    const date = new Date();
    const role=req.originalUrl.toString().split('/')[1]
    var attend_model=mongoose.model(name);
    const year = date.getFullYear();
    var datetext;
    // check for Current date & Assign req date
    if (req_date == "today") {
       datetext = format(date, "dd-MM-yyyy");
    } else {
      if(isValidDate(req_date))
         datetext =req_date;
      else
        datetext = format(date, "dd-MM-yyyy");
    }
    
    var section=section_map[sec];

   const student=await selected.findOne({rollno:id});
   const acad_data = await db.collection("academic_calendar").findOne({ year: year });
   var dayorder=acad_data[datetext].dayorder
   if (dayorder !='null') {
    //  get timetable from class
      const time_table=await class_model.findOne({id:title,section_name:sec},{time_table:1});
      // fetch Specific day
      const periods=time_table.time_table[`day${dayorder}`];
     
      const common=  await attend_model.findOne({ [datetext]: { $exists: true } });
     if(common!=null){
       const student_attend=common[datetext][section][id]
       const ack=common[datetext][section].ack
      
      res.render('student/attendance',{student,student_attend,periods,dayorder,ack,datetext,role})
      }
      else{
        dayorder='null'
        res.render('student/attendance',{student,dayorder,datetext,role})
      }
    } else {
      res.render('student/attendance',{student,dayorder,datetext,role})
    }
   
    
   }
     


    