require('../../../database/database');
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const student_model=require('../../../models/admin/student_model');

// Models Here!
const class_model = require('../../../models/admin/section_model');
const subject_model = require('../../../models/admin/subject_model');
const staff_model = require("../../../models/admin/staff_information_model");
const class_fees=require('../../../models/admin/fees_models')
// Body-Parser
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
// env variable


// Class Name
const {classes_map}=require('../../universal_controller/class_map')



exports.class_list = async (req, res) => {  
    const mongo_list=mongoose.modelNames();
    const classes=mongo_list.filter(item=>item.includes('_batch')).sort((a, b) => b.localeCompare(a));
    console.log(classes);
  res.render("admin/class_info/class_list",{ classes,page_title: "Class Information List" });    
};

//Functions get staff details
async function get_staff() {
    try {
      const staff = await staff_model.find({class_incharge:'null'});
      return staff;
    } catch (error) {
      throw error;
    }
  }


exports.classes= async (req, res) => {
  const title =req.params.title;
  var name=title.split('_')[0];
  name= await classes_map[name];
try {
   const model=mongoose.model(title);

  const students_doc=await model.find({});
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





  const genderCount = students_doc.reduce((count, item) => {
    const gender = item['gender'];
  
    if (gender === 'Male') {
      count.boys++;
    } else if (gender === 'Female') {
      count.girls++;
    } else if (gender === 'Other') {
      count.others++;
    }
  
    return count;
  }, { boys: 0, girls: 0, others: 0 });
  
  var no_boys = genderCount.boys;
  var no_girls = genderCount.girls;
  var no_others = genderCount.others;
  var no_total =students_doc.length; 
  
      var staff = await get_staff();
      const sec=await class_model.find({id:title});
      
     const sub=await subject_model.find({id:title});
     res.render("admin/class_info/class",{ title,name, sec, staff, sub, no_boys, no_girls, no_others, no_total,fees,feesobj, add_section: "none",add_subject: "none"});  

  }
  catch(err) {
    console.log(err);
    res.redirect('/');
  }

 };
async function dog(){
// const names="2022-2023_batch";
// // const class_list=await student_model.student_mapping();
// // const model=class_list['2022-2023_batch'];
// // console.log(model);
// // model.find({}).then((data)=>{
// //     console.log(data);
// // })
// console.log(mongoose.modelNames());
// const batch=mongoose.model(names);
// const data= await batch.find({})
// console.log(data);
// // const modelss=mongoose.model(names);
// // modelss.find({}).then((data)=>{
// //     console.log(data);
// // });
const mongo_list=mongoose.modelNames();
const classes=mongo_list.filter(item=>item.includes('_batch')).sort((a, b) => b.localeCompare(a));
console.log(classes);

 }
// dog()