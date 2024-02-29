require("../../database/database");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const express = require("express");
const schedule = require("node-schedule");
const yearcal = require("date-fns");
const { format, eachDayOfInterval } = require("date-fns");
const fast2sms = require('fast-two-sms');
require("dotenv").config();
const bcrypt = require('bcrypt');


const staff_model = require("../../models/admin/staff_information_model");
const class_model = require("../../models/admin/section_model");
const subject_model = require("../../models/admin/subject_model");
const student_model = require("../../models/admin/student_model");
const assign_model = require("../../models/assignment/assignment_model");
const login_data = require('../../models/login_data/login_info_model');
const forum_model=require("../../models/admin/forum_model");
const class_fees=require("../../models/admin/fees_models");
const { log } = require("util");



// env variable

const dayhour=JSON.parse(process.env.DAYHOUR);

// class Names
const {classes_map}=require('../universal_controller/class_map');

var db = mongoose.connection;
// Body-Parser
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
exports.add_forum = async (req, res) => {
    try { 
        const { id } = req.params; 
        const staffdata = await staff_model.find({_id:id}); 
        const classmodel = await class_model.findOne({'section_incharge_id': staffdata[0].staff_id});
        const forummodel = await forum_model.findOne({'forum_incharge.staff_id': staffdata[0].staff_id}); 
        const title = req.params.title;
        const sec = req.params.section;
        let forumDetails = null;
        if (forummodel) {
            forumDetails = {
                forum_title: forummodel.forum_title,
                forum_class: forummodel.forum_class,
                total: forummodel.total
            };
        } else {
            console.error("Forum data not found for the staff");
        }

        let classInchargeDetails = null;
        if (!classmodel) {
            console.error("Class data not found for the staff");
        } else if (classmodel.section_incharge_id === staffdata[0].staff_id) {
            classInchargeDetails = {
                classname: classmodel.id,
                sectioname: classmodel.section_name,
                sectioninchargeid: classmodel.section_incharge_id,
                sectioninchargename: classmodel.section_incharge_name,
                roomnumber: classmodel.room_number
            };
        } else {
            console.error("Staff is not in charge of any section");
        }

        res.render('./staff/forum_classes', { staffdata, classInchargeDetails, forumDetails,title,sec });
    } catch (error) {
        console.error("Error occurred:", error);
        res.send("Internal Server Error");
    }
}


async function get_staff() {
    try {
      const staff = await staff_model.find({ class_incharge: 'null' });
      return staff;
    } catch (error) {
      throw error;
    }
  }

// View Section
exports.view_section = async (req, res) => {
    const { id,title,section } = req.params; 
    const staffdata = await staff_model.find({_id:id}); 
    var fees= await class_fees.findOne({class:name},{_id:0,class:0,total:0,__v:0});
    
    const prop=req.params.prop;
    var name=title.split('_')[0];
    name=classes_map[name];
    let formprop={
             
              student_info_student: "none",
              student_info_personal: "none",
    }
    
    
  
    const student_schema = mongoose.model(title);
  
    if (!student_schema) {
      console.log("Invalid title");
      return res.status(400).send("Invalid title");
    }
  
    try {
      const students_doc= await student_schema.find({id:title,section:section});
      
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
  
      
      var no_boys = genderCount.boys;
      var no_girls = genderCount.girls;
      var no_others = genderCount.others;
      var no_total = no_boys+no_girls+no_others;
      var staff_doc = await get_staff();
      const section_doc= await class_model.findOne({id:title,section_name:section});
   
  
      
            res.render("./staff/view_class", {
              section_doc,
              students_doc,
              dayhour,
              name,
              fees,
              staff_doc,
              title,
              no_boys,
              no_girls,
              no_others,
              no_total,
              formprop,
              staffdata
            });
  
          }
            catch (err) {
              console.log(err);
            }      
      
  };

  //go_back_section
exports.go_back_section = async (req, res) => {
    const _id = req.params._id;
    const title = req.params.title;
    const sec = req.params.section;
    res.redirect(
      "/staff/forum/view_class/submit_student_basic/" + _id + "/" + title + "/" + sec
    );
  };
  
//------------------- STUDENT FUNCTIONS -------------------

exports.submit_student_basic = async (req, res) => {
  var current_student
  const { id,title,section } = req.params; 
  const staffdata = await staff_model.find({_id:id}); 

  const batch=title.split('_batch')[0];
  console.log("datas here : ",req.body);

  try {
      
      const StudentModel =await mongoose.model(title);
      const TestModel=mongoose.model(batch+"_test");
      const salt = 10;
      const hashedPassword = await bcrypt.hash(req.body.student_password, salt);

     const data= [
          {
          user_id: req.body.student_rollno,
          gender: req.body.gender,
          password: hashedPassword,
          role: title+"_"+section
         },
         {
          user_id: req.body.student_rollno+"_p",
          gender: req.body.gender,
          password: hashedPassword,
          role: title+"_"+section+"_parent"
         }
      ]
      const saved_data= await login_data.create(data)
          
      var obj_id = saved_data[0]._id;

          if (StudentModel && TestModel) {
              const student_submit = new StudentModel({
                  obj_id: obj_id,
                  id: title,
                  name: req.body.student_name,
                  gender: req.body.gender,
                  rollno: req.body.student_rollno,
                  section: section,
              });

              const student_test_detais=new TestModel({
                  rollno:req.body.student_rollno,
                  batch:batch,
                  section: section,
                  test_marks:[],
                  assignments:[]
              })

              current_student_doc= await student_submit.save();
              
              current_student_test_doc= await student_test_detais.save();
             
              
          } else {
              console.log('Invalid title');
              res.status(400).send('Invalid title');
          }

    res.redirect(`./staff/view_class${id}/${title}/${section}/student_info_personal/${current_student_doc._id}`)
 
  } catch (error) {
      console.log('infoErrors', error);
  }
};

// submit student other Information
exports.submit_student_details = async (req, res) => {
  try {
      const studentId = req.params.stu_id;
      const id = req.params.sec_id;
      const title = req.params.title;
      const section = req.params.section;

      console.log(title);
      const StudentModel = mongoose.model(title);

      console.log('Updating document with _id:', studentId);

      const studentDetails = {
          dob: req.body.dob,
          gender: req.body.gender,
          blood_group: req.body.blood_group,
          phone: req.body.phone,
          emis:req.body.emis,
          father_name: req.body.father_name,
          mother_name: req.body.mother_name,
          address: req.body.address,
          aadhar_no: req.body.aadhar_no,
          nativity: req.body.nativity,
          community: req.body.community,
          email: req.body.email,
          transport_type: req.body.transport_type,
          disability: req.body.disability,
      }
    
      updatedStudent= await StudentModel.findByIdAndUpdate(studentId,studentDetails ,{ new: true });

      if (updatedStudent) {
          console.log('Data updated successfully!');
      } else {
          console.log('No records were updated.');
      }
     // res.redirect(`/admin/class_info/class_list/view_section/${id}/${title}/${section}`)
     res.redirect(`/view_section/add_student/${id}/${title}/${section}/student_info_parent/${studentId}`)
     
  } catch (error) {
      console.error('An error occurred:', error);
      res.status(500).json({ error: 'An error occurred' });
  }
};
// Student parent submission
exports.submit_student_parent = async (req, res) => {
  try {
      const studentId = req.params.stu_id;
      const id = req.params.sec_id;
      const title = req.params.title;
      const section = req.params.section;

      console.log(title);
      const StudentModel = mongoose.model(title);

      console.log('Updating document with _id:', studentId);

      const studentDetails = req.body;
    
      updatedStudent= await StudentModel.findByIdAndUpdate(studentId,studentDetails ,{ new: true });

      if (updatedStudent) {
          console.log('Data updated successfully!');
      } else {
          console.log('No records were updated.');
      }
      res.redirect(`/admin/class_info/class_list/view_section/${id}/${title}/${section}`)
     
  } catch (error) {
      console.error('An error occurred:', error);
      res.status(500).json({ error: 'An error occurred' });
  }
};

exports.delete_student = async (req, res) => {
  const _id = req.params._id;
  const title = req.params.title;
  const sec = req.params.section;
  const _sec_id = req.params._sec_id;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).json({ message: 'Invalid ObjectId' });
  }

  try {

      // Construct a dynamic model variable based on the "title"
      const modelVariable = title.toLowerCase().replace(' ', '_') + '_schema';
      const student_schema = student_model[modelVariable];

      await student_schema.findById(_id).then((student_doc) => {
          login_id = student_doc.obj_id;
          login_data.findByIdAndRemove(login_id).then((deleted) => {
              if (!deleted) {
                  console.log('Cannot Delete');
              } else {
                  console.log("Record Deleted also in Login Data")
              }
          });
      });

      const deleted = await student_schema.findByIdAndRemove(_id);
      if (!deleted) {
          console.log('Cannot Delete');
      } else {
          console.log('Student Record Deleted Successfully');
      }
      res.redirect("/admin/class_info/class_list/view_section/"+_sec_id+"/"+title+"/"+sec);

  } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.view_student = async (req, res) => {
  const title = req.params.title;
  const sec = req.params.section;
  const id = req.params._id;



  const selectedModel = mongoose.model(title);

  if (!selectedModel) {
      console.log("Invalid title");
      return res.status(400).send("Invalid title");
  }

      var hash_student_password;

      login_data.find({obj_id:id}).then(async (login_doc) => {
          hash_student_password = login_doc[0].password;
      selectedModel.findById(id, (err, student_doc) => {
          if (err) {
              console.log(err);
              return res.status(500).send("Error retrieving student document");
          } else {
              res.render("admin/class_info/view_student", { title, sec, id, student_doc, hash_student_password });
          }
      });
  });
}