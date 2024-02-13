require("../../database/database");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const express = require("express");
const schedule = require("node-schedule");
const { format, eachDayOfInterval } = require("date-fns");
const fast2sms = require('fast-two-sms')

const staff_model = require("../../models/admin/staff_information_model");
const class_model = require("../../models/admin/section_model");
const subject_model = require("../../models/admin/subject_model");
const student_model = require("../../models/admin/student_model");
const assign_model = require("../../models/assignment/assignment_model");


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
      
        res.render('staff/assignment',{staffdata,subject});
    } catch (error) {
      console.log(error);
    }
 
 
}

exports.assignment_list=async(req,res)=>{
  const id=req.params.id;
  const params=req.params;
  console.log(params);
 
  try {
    const staffdata = await staff_model.find({ _id:id },{ staff_id: 1, staff_name: 1, });
    const assign=await assign_model.find({class:params.class,sec:params.sec,sub:params.sub})

     res.render('staff/assignment_list',{staffdata,item:params,assign});
   
  } catch (error) {
    console.log('assignment_list',error);
  }
 
}


exports.new_assignment= async (req,res)=>{
  const id=req.params.id;
  const params=req.params

  // let test_collection=req.params.class.split("_batch")[0]+"_test"
  // console.log("collection name: "+ test_collection);

  // test_collection = mongoose.model(test_collection)

  // console.log("collection name: "+ test_collection);


  try {
    
    
    const data= new assign_model({
      title:req.body.title,
      unit:req.body.unit,
      desc:req.body.desc,
      due:req.body.date,
      class:params.class,
      sec:params.sec,
      sub:params.sub
    })
   
    const result= await data.save();
    const assignment=[{
      ref_id:result._id,
      source:'null',
      mark:0
      
    }]

    



    const selected =mongoose.model(params.class)
    const classdata=await selected.find({section:params.sec});
    classdata.forEach(async(student )=> {
      const res = await selected.findOneAndUpdate(
        { rollno: student.rollno },
        { $push: { assignment: { $each: assignment } } }
      );
     console.log(res);
    });
    
     res.redirect(`/staff/assignment_list/${id}/${params.class}/${params.sec}/${params.sub}`);
 
   
  } catch (error) {
    console.log('assignment_list',error);
  }

  // res.send("sucess")
 
}


exports.viewlist=async (req,res)=>{
  const id=req.params.id;
  const params=req.params;
  const staffdata = await staff_model.find({ _id:id },{ staff_id: 1, staff_name: 1, });
  const name = params.class.toLowerCase().replace(" ", "_")+'s';
 console.log(name);

 const list=await assign_model.aggregate([
  {
    $match: {
      _id: mongoose.Types.ObjectId(params.assign_id)
    }
  },
  {
   
    $lookup: {
      from: name, 
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
console.log(list[0]);
res.render('staff/assign_student_list',{staffdata,list:list[0],params},)
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

