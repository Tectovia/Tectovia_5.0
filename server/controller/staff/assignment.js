require("../../database/database");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const express = require("express");
const schedule = require("node-schedule");
const { format, eachDayOfInterval } = require("date-fns");
const staff_model = require("../../models/admin/staff_information_model");
const class_model = require("../../models/admin/section_model");
const subject_model = require("../../models/admin/subject_model");
const student_model = require("../../models/admin/student_model");
let {classes_map} = require('../universal_controller/class_map')
const {noOfCirculars}=require('../universal_controller/notificationFunction')


var db = mongoose.connection;
// Body-Parser
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

exports.assignment=async (req,res)=>{
    const id=req.params.id;
    try {
      const staffdata = await staff_model.find({ _id: id },{ staff_id: 1, staff_name: 1, });
      // Replace with the actual staff ID
      const subject = await staff_model.aggregate([
        {
          $match: { "staff_id": staffdata[0].staff_id }
        },
        {
          $project: {
            timetable: {
              $concatArrays: [
                "$time_table.day1", "$time_table.day2", "$time_table.day3", "$time_table.day4", "$time_table.day5", "$time_table.day6"
              ]
            }
          }
        },
        {
          $unwind: "$timetable"
        },
        {
          $match: {
            "timetable.sub": { $ne: "null" }
          }
        },
        {
          $group: {
            _id: {
              class: "$timetable.class",
              class_section: "$timetable.sec", // Include class_section in the group
              subject: "$timetable.sub"
            }
          }
        },
        {
          $project: {
            _id: 0,
            class: "$_id.class",
            section: "$_id.class_section", // Include class_section in the final output
            subject: "$_id.subject"
          }
        },
        {
          $sort: {
            class: 1, // Sort ascending by class
            section: 1, // Sort ascending by section
            subject: 1 // Sort ascending by subject
          }
        }
      ]);

      let circularNotification = await noOfCirculars(staffdata[0].staff_id)
      
        res.render('staff/assignment',{staffdata,subject,circularNotification,classes_map});
    } catch (error) {
      console.log(error);
    }
 
 
}

exports.assignment_list=async(req,res)=>{
  const id=req.params.id;
  const params=req.params;
  var assign_name=params.class.split('_')[0]+"_assign";
  const assign_model=mongoose.model(assign_name)

  try {
    const staffdata = await staff_model.find({ _id:id },{ staff_id: 1, staff_name: 1, });
    const assign=await assign_model.find({sub:params.sub,sec:params.sec,staff_id:params.id});
    console.log(assign);
    let circularNotification = await noOfCirculars(staffdata[0].staff_id)
     res.render('staff/assignment_list',{staffdata,item:params,assign,circularNotification});
   
  } catch (error) {
    console.log('assignment_list',error);
  }
 
}


exports.new_assignment= async (req,res)=>{
  const id=req.params.id;
  const params=req.params;
try {
    
  var assign_name=params.class.split('_')[0]+"_assign";
  const assign_model=mongoose.model(assign_name)
    const data= new assign_model({
      title:req.body.title,
      unit:req.body.unit,
      desc:req.body.desc,
      due:req.body.date,
      class:params.class,
      sec:params.sec,
      sub:params.sub,
      staff_id:id

    })
   
    const result= await data.save();
    const assignment=[{
      ref_id:result._id,
      status:'null',
      
      
    }]
    var test_name=params.class.split('_')[0]+"_test"
   const selected =mongoose.model(test_name)
    const classdata=await selected.updateMany({}, { $push: { assignment: { $each: assignment } } },{new:true});
    
    console.log(classdata);
    
     res.redirect(`/staff/assignment_list/${id}/${params.class}/${params.sec}/${params.sub}`);
 
   
  } catch (error) {
    console.log('assignment_list',error);
  }

  // res.send("sucess")
 
}


exports.viewlist=async (req,res)=>{
  const id=req.params.id;
  const params=req.params;
  console.log("params ",params);
  const staffdata = await staff_model.find({ _id:id },{ staff_id: 1, staff_name: 1, });
  var name = params.class.split('_')[0]+"_assign"
  var test_name = params.class.split('_')[0]+"_tests"
  const assign_model=mongoose.model(name);


  const list=await assign_model.aggregate([
  {
    $match: {
      _id: mongoose.Types.ObjectId(params.assign_id)
    }
  },
  {
   
    $lookup: {
      from: test_name, 
      localField: '_id',
      foreignField: 'assignment.ref_id',
      as: 'assign'
    }
  },
  {
    $project: {
      'title':1,
      'unit':1,
      'sub':1,
      'desc':1,
      'due':1,
      'assign.assignment': 1,
      'assign.name': 1,
      'assign.rollno': 1,
    }
  }
])
let circularNotification = await noOfCirculars(staffdata[0].staff_id)
 // used to show circular notification for staff edited by purushothaman @ 14/3
 circularNotification = circularNotification.unSeenCirculars
 //----------------------------------------------------------------------
res.render('staff/assign_student_list',{staffdata,list:list[0],params ,circularNotification})
}

exports.ViewAssign=async(req,res)=>{
try {
  var {id,class_name,staff,rollno}=req.params;
  let student = await mongoose.model(class_name+'_batch').findById({id},{id:1,section:1,_id:1})
  var assign_model=mongoose.model(class_name+'_assign');
  const assignment=await assign_model.findById(id,{source:1});

  let circularNotification = await noOfCirculars(staff);
  // used to show circular notification for staff edited by purushothaman @ 14/3
 circularNotification = circularNotification.unSeenCirculars
 //----------------------------------------------------------------------

  var textcontent;
  const staffdata = await staff_model.find({ 'staff_id':staff },{ staff_id: 1, staff_name: 1, });

  assignment.source.forEach(element => {
    if(element[rollno])
      textcontent=element[rollno];
   });
  res.render('staff/assign_view',{textcontent,circularNotification,rollno,staffdata,id,class_name,student})
} catch (error) {
  console.log(error);
  res.redirect('/');
}

   
}

exports.submit_mark=async(req,res)=>{
  var {id,class_name,rollno,staff}=req.params
  
  var assign_model=mongoose.model(class_name+"_test");
 var result= await assign_model.findOneAndUpdate({'rollno':rollno,'assignment.ref_id':id},{$set:{'assignment.$.mark':req.body.mark}})
  console.log(result);
  res.redirect(`/staff/assignment/viewlist/${staff}/${class_name+"_batch"}/${result['section']}/${id}`)

}


// var options = {
//   authorization: 'mX6BWhkxd5peSFrq9b1wJAEyDtVYouKavNOMsTHZQP8G324fnImUDM4n6a2yZgHBS0FXRpzAYwk97j1w',
//   message: 'hello venkat',
//   numbers: ['9786984995']
// };

// async function hello(options) {
//   try {
//     const response = await fast2sms.sendMessage(options);

//     console.log(response);

//     if (response && response.return == true) {
//       console.log('something went wrong:', response.error);
//     } else {
//       console.log('message sent successfully');
//     }

//     const { wallet } = await fast2sms.getWalletBalance(options.authorization);
//     console.log('Wallet balance:', wallet);
//   } catch (error) {
//     console.error('Error sending message:', error);
//   }
// }

// hello(options);

