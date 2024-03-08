require("../../../database/database");
const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
require("../../universal_controller/image_saver");
const staff_model = require("../../../models/admin/staff_information_model");
const class_model = require("../../../models/admin/section_model");
const { log, error } = require("console");
const image_saver = require("../../universal_controller/image_saver");
const fs = require("fs");
const login_data =require( '../../../models/login_data/login_info_model');
const bcrypt = require("bcrypt");
// Body-Parser
const app = express();
const dayhour = JSON.parse(process.env.DAYHOUR);

app.use(bodyParser.urlencoded({ extended: false }));

exports.admin_staff_list = async (req, res) => {
  staff_model.find({available:true}).then((data) => {
    res.render("admin/staff_info/staff_list", {
      data,
      page_title: "Staff Information List",
      add: "none",
    });
  });
};

// exports.staff_index = async (req, res) => {
//   res.render('staff_index');
// };
exports.add_staff = async (req, res) => {
  staff_model.find().then((data) => {
    res.render("admin/staff_info/staff_list", {
      data,
      page_title: "Staff Information List",
      add: "display",
    });
  });
};

exports.new_staff = async (req, res) => {
  var staffid = req.body.staff_id;
  var staffname = req.body.staff_name;
  var staff_pass = req.body.staff_pass;
  var staff_designation=req.body.staff_designation;
  var data = {
    day1: [
      { sub: "null", class: "null", sec: "null" },
      { sub: "null", class: "null", sec: "null" },
      { sub: "null", class: "null", sec: "null" },
      { sub: "null", class: "null", sec: "null" },
      { sub: "null", class: "null", sec: "null" },
      { sub: "null", class: "null", sec: "null" },
      { sub: "null", class: "null", sec: "null" },
      { sub: "null", class: "null", sec: "null" },
      { sub: "null", class: "null", sec: "null" },
      { sub: "null", class: "null", sec: "null" },
    ],
    day2: [
      { sub: "null", class: "null", sec: "null" },
      { sub: "null", class: "null", sec: "null" },
      { sub: "null", class: "null", sec: "null" },
      { sub: "null", class: "null", sec: "null" },
      { sub: "null", class: "null", sec: "null" },
      { sub: "null", class: "null", sec: "null" },
      { sub: "null", class: "null", sec: "null" },
      { sub: "null", class: "null", sec: "null" },
      { sub: "null", class: "null", sec: "null" },
      { sub: "null", class: "null", sec: "null" },
    ],
    day3: [
      { sub: "null", class: "null", sec: "null" },
      { sub: "null", class: "null", sec: "null" },
      { sub: "null", class: "null", sec: "null" },
      { sub: "null", class: "null", sec: "null" },
      { sub: "null", class: "null", sec: "null" },
      { sub: "null", class: "null", sec: "null" },
      { sub: "null", class: "null", sec: "null" },
      { sub: "null", class: "null", sec: "null" },
      { sub: "null", class: "null", sec: "null" },
      { sub: "null", class: "null", sec: "null" },
    ],
    day4: [
      { sub: "null", class: "null", sec: "null" },
      { sub: "null", class: "null", sec: "null" },
      { sub: "null", class: "null", sec: "null" },
      { sub: "null", class: "null", sec: "null" },
      { sub: "null", class: "null", sec: "null" },
      { sub: "null", class: "null", sec: "null" },
      { sub: "null", class: "null", sec: "null" },
      { sub: "null", class: "null", sec: "null" },
      { sub: "null", class: "null", sec: "null" },
      { sub: "null", class: "null", sec: "null" },
    ],
    day5: [
      { sub: "null", class: "null", sec: "null" },
      { sub: "null", class: "null", sec: "null" },
      { sub: "null", class: "null", sec: "null" },
      { sub: "null", class: "null", sec: "null" },
      { sub: "null", class: "null", sec: "null" },
      { sub: "null", class: "null", sec: "null" },
      { sub: "null", class: "null", sec: "null" },
      { sub: "null", class: "null", sec: "null" },
      { sub: "null", class: "null", sec: "null" },
      { sub: "null", class: "null", sec: "null" },
    ],
    day6: [
      { sub: "null", class: "null", sec: "null" },
      { sub: "null", class: "null", sec: "null" },
      { sub: "null", class: "null", sec: "null" },
      { sub: "null", class: "null", sec: "null" },
      { sub: "null", class: "null", sec: "null" },
      { sub: "null", class: "null", sec: "null" },
      { sub: "null", class: "null", sec: "null" },
      { sub: "null", class: "null", sec: "null" },
      { sub: "null", class: "null", sec: "null" },
      { sub: "null", class: "null", sec: "null" },
    ],
  };

  const add_staff = new staff_model({
    staff_name: staffname,
    staff_password: staff_pass,
    staff_gender:req.body.gender,
    staff_id: staffid,
    class_incharge: 'null',
    staff_designation:staff_designation,
    time_table: data,
  });

await  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      res.send(err);
    }
    bcrypt.hash(staff_pass, salt, (err, hashed_pass) => {
      var hashed_password = hashed_pass;
      if (err) {
        res.send(err);
      }
      const login = new login_data({
        user_id: staffid,
        password: hashed_password,
        role: "staff",
      });
      login.save().then(() => {
        console.log("Staff added in login db");
      }).catch(err=>{
          console.log(err);
      });
    });
  });

  add_staff.save().then((data) => {
    console.log(data.id);
    res.render("admin/staff_info/staff_personal_details_form", { data });
  });
  console.log("inserted successfully");
};

exports.staff_personal = async (req, res) => {
  var staff_id = req.params.id;
  var staff_rollno = req.body.staff_id;
  // file path
  var path =
    require("path").resolve("./") +
    "/public/uploads/staff_info/" +
    staff_rollno;
  var Object = req.body;
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
  var uploadpath =
    require("path").resolve("./") +
    "/public/uploads/staff_info/" +
    staff_rollno +
    "/";
  //  image saver
  if (req.files) {
    if (req.files.staff_community_img)
      Object.staff_community_img = image_saver(
        req.files.staff_community_img,
        "_community_",
        uploadpath,
        staff_rollno
      );

    if (req.files.staff_profile)
      Object.staff_profile_img = image_saver(req.files.staff_profile,"  ", uploadpath, staff_rollno);

    if (req.files.staff_income_img)
      Object.staff_income_img = image_saver(
        req.files.staff_income_img,
        "_income_",
        uploadpath,
        staff_rollno
      );

    if (req.files.staff_disability_img)
      Object.staff_disability_img = image_saver(
        req.files.staff_disability_img,
        "_disability_",
        uploadpath,
        staff_rollno
      );

    if (req.files.staff_experience_img)
      Object.staff_experience_img = image_saver(
        req.files.staff_experience_img,
        "_experience_",
        uploadpath,
        staff_rollno
      );

    if (req.files.staff_account_passbook)
      Object.staff_account_passbook = image_saver(
        req.files.staff_account_passbook,
        "_passbook_",
        uploadpath,
        staff_rollno
      );

    if (req.files.staff_aadhar_img)
      Object.staff_aadhar_img = image_saver(
        req.files.staff_aadhar_img,
        "_aadhar_",
        uploadpath,
        staff_rollno
      );
  }

  staff_model
    .findByIdAndUpdate(staff_id, Object)
    .then((data) => {
      console.log(data);
      res.redirect(`/admin/staff_info/staff_education_form/${staff_id}`);
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.staff_education_form=async(req,res)=>{
  var staff_id=req.params.staff;
  try {
    var data=staff_model. findById(staff_id)
    
      console.log(data);
      res.render("admin/staff_info/staff_education_form", { data });
    
  } catch (error) {
    console.log(err);
    res.redirect('/');
  }
 
    
   
}
exports.staff_education = async (req, res) => {
  staff_id = req.params.id;

  obj = req.body;

  var staff_rollno = req.body.staff_id;
  // require  data

  // file path
  var path =
    require("path").resolve("./") +
    "/public/uploads/staff_info/" +
    staff_rollno;

  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
  var uploadpath =
    require("path").resolve("./") +
    "/public/uploads/staff_info/" +
    staff_rollno +
    "/";
  // save image file
  if (req.files) {
    if (req.files.staff_sslc_marksheet)
      obj.staff_sslc_marksheet = image_saver(
        req.files.staff_sslc_marksheet,
        "_sslc_",
        uploadpath,
        staff_rollno
      );
    if (req.files.staff_hsc_marksheet)
      obj.staff_hsc_marksheet = image_saver(
        req.files.staff_hsc_marksheet,
        "_hsc_",
        uploadpath,
        staff_rollno
      );
    if (req.files.staff_ug_marksheet)
      obj.staff_ug_marksheet = image_saver(
        req.files.staff_ug_marksheet,
        "_ug_",
        uploadpath,
        staff_rollno
      );
    if (req.files.staff_pg_marksheet)
      obj.staff_pg_marksheet = image_saver(
        req.files.staff_pg_marksheet,
        "_pg_",
        uploadpath,
        staff_rollno
      );
    if (req.files.staff_bed_marksheet)
      obj.staff_bed_marksheet = image_saver(
        req.files.staff_bed_marksheet,
        "_B-ed_",
        uploadpath,
        staff_rollno
      );
    if (req.files.staff_med_marksheet)
      obj.staff_med_marksheet = image_saver(
        req.files.staff_med_marksheet,
        "_M-ed_",
        uploadpath,
        staff_rollno
      );
    if (req.files.staff_mpill_marksheet)
      obj.staff_mpill_marksheet = image_saver(
        req.files.staff_mpill_marksheet,
        "_mpill_",
        uploadpath,
        staff_rollno
      );
    if (req.files.staff_add_pg_marksheet)
      obj.staff_add_pg_marksheet = image_saver(
        req.files.staff_add_pg_marksheet,
        "_Add_pg_",
        uploadpath,
        staff_rollno
      );
  }

  staff_model.findByIdAndUpdate(staff_id, obj).then((data) => {
      console.log("updated successfuly");
      res.render("admin/staff_info/staff_achivements_form", { data });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.staff_achivements = async (req, res) => {
  staff_id = req.params.id;
  console.log(staff_id);
  console.log(req.body);
  obj = req.body;

  staff_model
    .findByIdAndUpdate(staff_id, obj)
    .then((data) => {
      console.log(data);
      console.log("updated successfuly");
      res.redirect("/admin/staff_info");
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.staff_delete = async (req, res) => {
  var id = req.params.id;
  staff_model.findById(id,{time_table:1}).then((data) => {

    console.log(dayhour);
    for (let i = 1; i <= dayhour.day; i++) {
      for (let j = 0; j < dayhour.hr; j++) {
      
        if (data.time_table["day" + i][j].sub != "null") {
          var class_name = data.time_table["day" + i][j].class;
          var section_name = data.time_table["day" + i][j].sec;
          class_model
            .findOneAndUpdate(
              { id: class_name, section_name: section_name },
              {
                $set: {
                  [`time_table.day${i}.${j}.sub`]: "null",
                  [`time_table.day${i}.${j}.staff_name`]: "null",
                  [`time_table.day${i}.${j}.staff_id`]: "null",
                },
              }
            )
            .then((x) => {
              console.log(
                `data deleted successfully in day${i} hour ${j} at ${class_name} sec:${section_name}`
              );
              console.log(x);
            });
        }
      }
    }
  })
  console.log("id is "+id);

   let updatedDocument = await staff_model.findByIdAndUpdate(id,{available:false,class_incharge:null},{new:true}).catch((error)=>{
    console.log(error);
   })

   await class_model.findOneAndUpdate({section_incharge_id:updatedDocument.staff_id,section_incharge_name:updatedDocument.staff_name},
                                      {section_incharge_id:null,section_incharge_name:null})

   await login_data.deleteOne({user_id:updatedDocument.staff_id}).catch((error)=>{
    console.log(error);
   })

//  staff_model.findByIdAndDelete(id, function (err, docs) { 
//   if (err){ 
//       console.log(err) 
//   } 
//   else{ 
//       console.log("Deleted : ", docs); 
//       const del_id=docs.staff_id;
//       login_data.deleteOne({user_id:del_id},(err,data)=>{
//         if(err){
//           console.log(err);
//         }
//         else{
//           console.log('deleted successfully',data);
//         }
//       })
      
//   } 
// }); 
    res.redirect("/admin/staff_info");

};


exports.staff_view = async (req, res) => {
  var id = req.params.id;
  staff_model.findById(id).then((data) => {
    console.log(data);
    res.render("admin/staff_info/view_staff", {
      data,
      personal: "none",
      education: "none",
      achievement: "none",
      document: "none",
    });
  });
};
// ------------------------staff_personal_edit----------------------------
exports.staff_personal_edit = async (req, res) => {
  var id = req.params.id;
  staff_model.findById(id).then((data) => {
    console.log(data);
    res.render("admin/staff_info/view_staff", {
      data,
      personal: "display",
      education: "none",
      achievement: "none",
      document: "none",
    });
  });
};
//---------------------------staff_personal_edit-submission----------------
exports.personal_edit_submission = async (req, res) => {
  var staff_id = req.params.id;
  var staff_rollno = req.body.staff_id;
  // file path
  var path =
    require("path").resolve("./") +
    "/public/uploads/staff_info/" +
    staff_rollno;

  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
  var uploadpath =  require("path").resolve("./") +  "/public/uploads/staff_info/" +  staff_rollno + "/";

  var Object = req.body;
  //  image saver
  if (req.files) {
    if (req.files.staff_profile)
      Object.staff_profile_img = image = image_saver(req.files.staff_profile,"profile_", uploadpath);

    if (req.files.staff_community_img)
      Object.staff_community_img = image_saver( req.files.staff_community_img, "community_", uploadpath );

    if (req.files.staff_income_img) {
      Object.staff_income_img = image_saver( req.files.staff_income_img, "income_", uploadpath);
    }

    if (req.files.staff_disability_img)
      Object.staff_disability_img = image_saver( req.files.staff_disability_img, "disability_", uploadpath);

    if (req.files.staff_experience_img)
      Object.staff_experience_img = image_saver(  req.files.staff_experience_img,  "experience_",  uploadpath);

    if (req.files.staff_account_passbook)
      Object.staff_account_passbook = image_saver(  req.files.staff_account_passbook,  "passbook_",  uploadpath);

    if (req.files.staff_aadhar_img) 
    Object.staff_aadhar_img = image_saver(   req.files.staff_aadhar_img,   "aadhar_",uploadpath);
  }
  staff_model
    .findByIdAndUpdate(staff_id, Object)
    .then((data) => {
      console.log(data);
      res.redirect(`/admin/staff_info/staff_list/view/${staff_id}`);
    })
    .catch((err) => {
      console.log(err);
    });
};
//---------------------staff education edit button-----------
exports.staff_education_edit = async (req, res) => {
  var id = req.params.id;
  staff_model.findById(id).then((data) => {
    console.log(data);
    res.render("admin/staff_info/view_staff", {
      data,
      personal: "none",
      education: "display",
      achievement: "none",
      document: "none",
    });
  });
};
//---------------------staff education edit submission-----------
exports.education_edit_submission = async (req, res) => {
  staff_id = req.params.id;

  var obj = req.body;

  var staff_rollno = req.body.staff_id;
  // require  data

  var path =
    require("path").resolve("./") +
    "/public/uploads/staff_info/" +
    staff_rollno;

  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
  var uploadpath =
    require("path").resolve("./") + "/public/uploads/staff_info/" + staff_rollno + "/";
  // save image file
  if (req.files) {
    if (req.files.staff_sslc_marksheet)
      obj.staff_sslc_marksheet = image_saver(
        req.files.staff_sslc_marksheet,
        "sslc_",
        uploadpath,
        
      );
    if (req.files.staff_hsc_marksheet)
      obj.staff_hsc_marksheet = image_saver(
        req.files.staff_hsc_marksheet,
        "hsc_",
        uploadpath,
        
      );
    if (req.files.staff_ug_marksheet)
      obj.staff_ug_marksheet = image_saver(
        req.files.staff_ug_marksheet,
        "ug_",
        uploadpath,
      
      );
    if (req.files.staff_pg_marksheet)
      obj.staff_pg_marksheet = image_saver(
        req.files.staff_pg_marksheet,
        "pg_",
        uploadpath,
       
      );
    if (req.files.staff_bed_marksheet)
      obj.staff_bed_marksheet = image_saver(
        req.files.staff_bed_marksheet,
        "B-ed_",
        uploadpath,
       
      );
    if (req.files.staff_med_marksheet)
      obj.staff_med_marksheet = image_saver(
        req.files.staff_med_marksheet,
        "M-ed_",
        uploadpath,
      
      );
    if (req.files.staff_mpill_marksheet)
      obj.staff_mpill_marksheet = image_saver(
        req.files.staff_mpill_marksheet,
        "mpill_",
        uploadpath,
       
      );
    if (req.files.staff_add_pg_marksheet)
      obj.staff_add_pg_marksheet = image_saver(
        req.files.staff_add_pg_marksheet,
        "Add_pg_",
        uploadpath,
      
      );
  }

  staff_model
    .findByIdAndUpdate(staff_id, obj)
    .then((data) => {
      console.log("updated successfuly");
      res.redirect(`/admin/staff_info/staff_list/view/${staff_id}`);
    })
    .catch((err) => {
      console.log(err);
    });
};
// -----------------------staff  achievement -------------------
exports.staff_achievement_edit = async (req, res) => {
  var id = req.params.id;
  staff_model.findById(id).then((data) => {
    console.log(data);
    res.render("admin/staff_info/view_staff", {
      data,
      personal: "none",
      education: "none",
      achievement: "display",
      document: "none",
    });
  });
};
// -------------------------staff document view----------
exports.staff_document_view = async (req, res) => {
  var id = req.params.id;
  staff_model.findById(id).then((data) => {
    res.render("admin/staff_info/view_staff", {
      data,
      personal: "none",
      education: "none",
      achievement: "none",
      document: "display",
    });
  });
};
