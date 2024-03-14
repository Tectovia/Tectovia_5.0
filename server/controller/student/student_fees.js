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

 //Fees function
 exports.fees=async(req,res)=>{

    const title =req.params.title;
    const role=req.originalUrl.toString().split('/')[1]
    const id=req.params.id;
  var name=title.split('_')[0];
  name= await classes_map[name];
   const models=mongoose.model(title);
       // this is to find no of notifications added by purushothaman @ 29/2 7.34 am
       var student=await models.findOne({rollno:id});
  let notification = await noOfNotificationsForStudents(student.rollno,student.id)
  var fees= await class_fees.findOne({class:name},{_id:0,class:0,total:0,__v:0});
 var feesobj={
  fees_term:[],
  fees_title:[],
  fees_amount:[],

 }
if (fees!=null) {
  var fee=fees.toObject();
  for(var key in fee){
    for (let j = 0; j <fee[key].length; j++) {
     feesobj.fees_term.push(key);
     feesobj.fees_title.push(fee[key][j]['fees_title']);
     feesobj.fees_amount.push(fee[key][j]['fees_amount']);
      
    }
  }
  
}
console.log(student);
console.log(fees);
res.render('student/fees',{student,fees,role,notification})
}
