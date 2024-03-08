const { connect, default: mongoose } = require("mongoose");
const bodyParser = require("body-parser");
const express = require("express");
require("./../../database/database");
const bcrypt = require("bcrypt");
const session = require("express-session");
const login_data = require("../../models/login_data/login_info_model");
const attendance_schema=require('../../models/admin/attendance_model')
// Body-Parser
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));



exports.uni_index = async (req, res) => {
  
  if (req.session.user_id) {
    if (req.session.role=='admin') {
     res.redirect("/admin_index");
    

  }
  else if (req.session.role.includes("Standard")) {
    res.redirect(`/student_index/${req.session.user_id}/${req.session.role}`);
   }
   else if (req.session.role=='staff') {
    res.redirect(`/staff_index/${req.session.user_id}`);
   }
    else {
    res.render("universal/home_page");
  }
  } 
  else {
    console.log("session not found");
    res.render("universal/home_page",);
  }
};

exports.login_page = async (req, res) => {
  
  if(req.session.user_id){
    console.log(req.session.user_id);
    
  if (req.session.role=='admin') {
    res.redirect("/admin_index");
   

 }
 else if (req.session.role.includes('Standard')) {
   res.redirect(`/student_index/${req.session.user_id}/${req.session.role}`);
  }
  else if (req.session.role=='staff') {
   res.redirect(`/staff_index/${req.session.user_id}`);
  }
  else
  { 
    return res.render("universal/login_page");
  }
 }
 else
  { 
    console.log("seseion not found");
    return res.render("universal/login_page");
  }
};

exports.admission = async (req, res) => { 
  res.render('universal/admission')
}

exports.login_submission = async (req, res) => {
  var id = req.body.user_id;
  var password = req.body.password;

  login_data.findOne({ user_id: id }).then(async (data) => {
    if (data) {


      console.log(data);
    
      var valid_password = await bcrypt.compare(password, data.password);
     
      if (valid_password) {
        req.session.user_id = data.user_id;
        req.session.role = data.role;
        
        console.log(req.session);

        if (data.role == "admin") {
         
          res.redirect(`/admin_index/`);
        } else if (data.role == "staff") {
          res.redirect(`staff_index/${id}`);
         
        } else if (data.role.includes('_batch_')) {
          if (data.role.includes('_parent')) {
            req.session.role=data.role;
            res.redirect(`/parent_index/${id}/${data.role}`);
            
          } 
          else{
            req.session.role=data.role;
            res.redirect(`/student_index/${id}/${data.role}`); 
          }
         
          
        }  
      } else {
        const errorMessage = "Incorrect username or password";
        res.render("universal/login_page",);
      }
    } else {
      res.send("user not found");
    }

  });
};

// adding user data
//adduser()
function adduser() {
  var user = "admin";
  var password = "123";

  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      res.send(err);
    }
    bcrypt.hash(password, salt, async (err, hashed_pass) => {
      var hashed_password = hashed_pass;
      if (err) {
        res.send(err);
      }
      var userdata = new login_data({
        user_id: user,
        password: hashed_password,
        role: "admin",
      });
      await userdata.save((err, data) => {
        console.log(data);
      });
    });
  });
}

exports.logout_session = async (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};

// adduser();


