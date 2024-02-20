require("../../../database/database");
const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const yearcal = require("date-fns");
require("dotenv").config();

// Models Here!
const class_model = require("../../../models/admin/section_model");
const subject_model = require("../../../models/admin/subject_model");
const student_model = require("../../../models/admin/student_model");
const staff_model = require("../../../models/admin/staff_information_model");
const { log } = require("console");
var db = mongoose.connection;
// Body-Parser
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
// env variable

const dayhour=JSON.parse(process.env.DAYHOUR);

// class Names
const {classes_map}=require('../../universal_controller/class_map');


async function get_staff() {
  try {
    const staff = await staff_model.find({ class_incharge: 'null' });
    return staff;
  } catch (error) {
    throw error;
  }
}

//------------------- SECTION FUNCTIONS -------------------

exports.submit_section = async (req, res) => {
  const title = req.params.title;
  
  var section_name = req.body.section_name;
  var section_incharge = req.body.section_incharge;
  var room_number = req.body.room_number;

  const attend_name = title.toLowerCase().replace(" ", "_") + "_" + section_name;
  // Update staff - class_incharge
  try {
    const class_incharge = `${title}_${section_name}`;

    const staff = await staff_model.findOne({ staff_id: section_incharge });

    if (!staff) {
      return res.status(400).json({ error: "Staff not found" });
    }

    staff.class_incharge = class_incharge;

    await staff.save();

    console.log("Staff Document Updated: ", staff);
  } catch (error) {
    console.log(error);
  }

  // Submit class section
  try {
    const staff = await staff_model.findOne({ staff_id: section_incharge });

    if (!staff) {
      return res.status(400).json({ error: "Staff not found" });
    }

    const staff_name = staff.staff_name;
    var data = {
      day1: [
        { sub: "null", staff_name: "null", staff_id: "null" },
        { sub: "null", staff_name: "null", staff_id: "null" },
        { sub: "null", staff_name: "null", staff_id: "null" },
        { sub: "null", staff_name: "null", staff_id: "null" },
        { sub: "null", staff_name: "null", staff_id: "null" },
        { sub: "null", staff_name: "null", staff_id: "null" },
        { sub: "null", staff_name: "null", staff_id: "null" },
        { sub: "null", staff_name: "null", staff_id: "null" },
        { sub: "null", staff_name: "null", staff_id: "null" },
        { sub: "null", staff_name: "null", staff_id: "null" },
      ],
      day2: [
        { sub: "null", staff_name: "null", staff_id: "null" },
        { sub: "null", staff_name: "null", staff_id: "null" },
        { sub: "null", staff_name: "null", staff_id: "null" },
        { sub: "null", staff_name: "null", staff_id: "null" },
        { sub: "null", staff_name: "null", staff_id: "null" },
        { sub: "null", staff_name: "null", staff_id: "null" },
        { sub: "null", staff_name: "null", staff_id: "null" },
        { sub: "null", staff_name: "null", staff_id: "null" },
        { sub: "null", staff_name: "null", staff_id: "null" },
        { sub: "null", staff_name: "null", staff_id: "null" },
      ],
      day3: [
        { sub: "null", staff_name: "null", staff_id: "null" },
        { sub: "null", staff_name: "null", staff_id: "null" },
        { sub: "null", staff_name: "null", staff_id: "null" },
        { sub: "null", staff_name: "null", staff_id: "null" },
        { sub: "null", staff_name: "null", staff_id: "null" },
        { sub: "null", staff_name: "null", staff_id: "null" },
        { sub: "null", staff_name: "null", staff_id: "null" },
        { sub: "null", staff_name: "null", staff_id: "null" },
        { sub: "null", staff_name: "null", staff_id: "null" },
        { sub: "null", staff_name: "null", staff_id: "null" },
      ],
      day4: [
        { sub: "null", staff_name: "null", staff_id: "null" },
        { sub: "null", staff_name: "null", staff_id: "null" },
        { sub: "null", staff_name: "null", staff_id: "null" },
        { sub: "null", staff_name: "null", staff_id: "null" },
        { sub: "null", staff_name: "null", staff_id: "null" },
        { sub: "null", staff_name: "null", staff_id: "null" },
        { sub: "null", staff_name: "null", staff_id: "null" },
        { sub: "null", staff_name: "null", staff_id: "null" },
        { sub: "null", staff_name: "null", staff_id: "null" },
        { sub: "null", staff_name: "null", staff_id: "null" },
      ],
      day5: [
        { sub: "null", staff_name: "null", staff_id: "null" },
        { sub: "null", staff_name: "null", staff_id: "null" },
        { sub: "null", staff_name: "null", staff_id: "null" },
        { sub: "null", staff_name: "null", staff_id: "null" },
        { sub: "null", staff_name: "null", staff_id: "null" },
        { sub: "null", staff_name: "null", staff_id: "null" },
        { sub: "null", staff_name: "null", staff_id: "null" },
        { sub: "null", staff_name: "null", staff_id: "null" },
        { sub: "null", staff_name: "null", staff_id: "null" },
        { sub: "null", staff_name: "null", staff_id: "null" },
      ],
      day6: [
        { sub: "null", staff_name: "null", staff_id: "null" },
        { sub: "null", staff_name: "null", staff_id: "null" },
        { sub: "null", staff_name: "null", staff_id: "null" },
        { sub: "null", staff_name: "null", staff_id: "null" },
        { sub: "null", staff_name: "null", staff_id: "null" },
        { sub: "null", staff_name: "null", staff_id: "null" },
        { sub: "null", staff_name: "null", staff_id: "null" },
        { sub: "null", staff_name: "null", staff_id: "null" },
        { sub: "null", staff_name: "null", staff_id: "null" },
        { sub: "null", staff_name: "null", staff_id: "null" },
      ],
    };

    console.log("batch here : ",title);
    const section_submit = new class_model({
      id: title,
      section_name: section_name,
      section_incharge_name: staff_name,
      section_incharge_id: section_incharge,
      room_number: room_number,
      time_table: data,
    });

    await section_submit.save();


    // create collection for attendance
    db.createCollection(`attend_${attend_name}`);

    console.log(section_submit, "Section submitted Successfully!");
    res.redirect(`/admin/class_info/class_list/${title}`);
  } catch (error) {
    console.log("infoErrors", error);
  }
};

exports.view_section = async (req, res) => {
  const title = req.params.title;
  const sec = req.params.section;
  const id = req.params.id;
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
    const students_doc= await student_schema.find({id:title,section:sec});
    
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
    var no_total = no_boys+no_girls+no_others;
    var staff_doc = await get_staff();
    const section_doc= await class_model.findOne({ _id: id });
 

    
          res.render("admin/class_info/view_section", {
            section_doc,
            students_doc,
            dayhour,
            name,
            staff_doc,
            title,
            no_boys,
            no_girls,
            no_others,
            no_total,
            formprop
          });

        }
          catch (err) {
            console.log(err);
          }      
    
};

exports.after_submission=async(req,res)=>{
  const title = req.params.title;
  const sec = req.params.section;
  const id = req.params.id;
  const prop=req.params.prop;
  const current_id=req.params.current;
  console.log("params",req.params);
  var name=title.split('_')[0];
  name=classes_map[name];
  let formprop={
           
            student_info_personal: "none",
            student_info_parent: "none",
  }
  formprop[prop]='display';

  const student_schema = mongoose.model(title)

  if (!student_schema) {
    console.log("Invalid title");
    return res.status(400).send("Invalid title");
  }
  
   
    var staff_doc = await get_staff();
 
  const current_student= await student_schema.findOne({_id:current_id})

 class_model.findOne({ _id: id }, function (err, section_doc) {
    console.log("section detail",section_doc);

    student_schema.find(
      { id: title, section: sec },
      function (err, students_doc) {
        if (err) {
          console.log(err);
        } else {

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
          res.render("admin/class_info/view_section", {
            section_doc,
            current_student,
            students_doc,
            dayhour,
            name,
            staff_doc,
            title,
            no_boys,
            no_girls,
            no_others,
            no_total,
            formprop
          });
        }
      }
    );
  });
};

exports.delete_section = async (req, res) => {
  const section_id = req.params.id;
  const title = req.params.title;
  const sec = req.params.section;

  try {


    const student_schema = mongoose.model(title);

    if (!student_schema) {
      console.log("Invalid title");
      return res.status(400).send("Invalid title");
    }
    
    // Delete student documents
    const deleted_students = await student_schema.deleteMany({
      id: title,
      section: sec,
    });

    if (deleted_students.deletedCount === 0) {
      console.log("Cannot Delete Student Documents");
    }

    // Update class incharge
    if (!mongoose.Types.ObjectId.isValid(section_id)) {
      return res.status(400).json({ message: "Invalid ObjectId" });
    }

    const docs = await class_model.findById(section_id).exec();

    if (!docs) {
      res.status(404).json({ error: "Document not found" });
    } else {
      const updatedStaff = await staff_model
        .findOneAndUpdate(
          { staff_id: docs.section_incharge_id },
          { class_incharge: null },
          { new: true }
        )
        .exec();  
        
        // console.log("Update successful", updatedStaff);    
        
      }
      
      
      
      const data = await class_model.findById(section_id,{time_table:1});
      for (let i = 1; i <= dayhour.day; i++) {
        for (let j = 0; j < dayhour.hr; j++) {
          if (data.time_table["day" + i][j].sub != "null") {
            var staff_id = data.time_table["day" + i][j].staff_id;
            
            console.log(staff_id);
            var editdata=await staff_model.findOneAndUpdate( {staff_id:staff_id},
              {
                $set: {
                  [`time_table.day${i}.${j}.sub`]: "null",
                  [`time_table.day${i}.${j}.class`]: "null",
                  [`time_table.day${i}.${j}.sec`]: "null",
                },
              }
              )
              // console.log(editdata);
            }
          }
        }
        
        
        const deleted = await class_model.findByIdAndRemove(section_id);
        
        if (!deleted) {
          console.log("Cannot Delete");
        }
        
        res.redirect(`/admin/class_info/class_list/${title}`);
      } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
      }
};
    

//------------------- SUBJECT FUNCTIONS -------------------

exports.submit_subject = async (req, res) => {
  const title = req.params.title;
  var name=title.split('_')[0];
  name=classes_map[name]; 
  
  try {
    const subject_submit = new subject_model({
      id: title,
      subject_name: req.body.subject_name,
      subject_code: req.body.subject_code,
      subject_medium: req.body.subject_medium,
    });

    await subject_submit.save();
    console.log(subject_submit, "Subject submitted Successfully!");
    res.redirect(`/admin/class_info/class_list/${title}`);
  } catch (error) {
    console.log("infoErrors", error);
  }
};

exports.view_subject = async (req, res) => {
  const title = req.params.title;
  var id = req.params.id;

  subject_model.findById(id, function (err, item) {
    if (err) {
      console.log(err);
    } else {
      res.render("admin/class_info/view_subject", {
        item,
        title,
        add_section: "none",
        add_subject: "none",
      });
    }
  });
};

exports.delete_subject = async (req, res) => {
  const id = req.params.id;
  const title = req.params.title;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ObjectId" });
  }

  try {
    const deleted = await subject_model.findByIdAndDelete(id);
    if (!deleted) {
      console.log("Cannot Delete");
    }
    var subject=deleted['subject_name'];
    var classes = await class_model.find({id:title},{time_table:1,section_name:1,id:1});
    classes.forEach( async (sect)=>{
     var section=sect.section_name;
      for (let i = 1; i <= dayhour.day; i++) {
        for (let j = 0; j < dayhour.hr; j++) {
         
          if (sect.time_table["day" + i][j].sub != "null"&&sect.time_table['day'+i][j].sub==subject) {
            var staff_id = sect.time_table["day" + i][j].staff_id;
            var editdata= await staff_model.findOneAndUpdate( {staff_id:staff_id},
              {
                $set: {
                  [`time_table.day${i}.${j}.sub`]: "null",
                  [`time_table.day${i}.${j}.class`]: "null",
                  [`time_table.day${i}.${j}.sec`]: "null",
                },
              }
              )
             var class_edit= await class_model.findOneAndUpdate({id:title,section_name:section},{
              $set:{
                [`time_table.day${i}.${j}.sub`]: "null",
                [`time_table.day${i}.${j}.staff_name`]: "null",
                [`time_table.day${i}.${j}.staff_id`]: "null",
              }
             });
             console.log("document",class_edit);
            }
          }
        }
    })


    

    res.redirect("/admin/class_info/class_list/" + title);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }

};

//close_form
exports.close_form = async (req, res) => {
  const title = req.params.title;
  
  res.redirect("/admin/class_info/class_list/" + title);
};

//go_back_class
exports.go_back_class = async (req, res) => {
  const title = req.params.title;
  
  res.redirect("/admin/class_info/class_list/" + title);
};

//go_back_section
exports.go_back_section = async (req, res) => {
  const _id = req.params._id;
  const title = req.params.title;
  const sec = req.params.section;
  res.redirect(
    "/admin/class_info/class_list/view_section/" + _id + "/" + title + "/" + sec
  );
};
