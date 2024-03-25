require("../../../database/database");
const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");

// Models Here!
const class_model = require("../../../models/admin/section_model");
const subject_model = require("../../../models/admin/subject_model");
const student_model = require("../../../models/admin/student_model");
const staff_model = require("../../../models/admin/staff_information_model");


const bonafide=require("../../../models/admin/bonafide_models");
const { id } = require("date-fns/locale");
var db = mongoose.connection;
// Body-Parser
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

exports.boo=async (req,res)=>{
  var bonafide_data=await bonafide.find();
  // When the admin approves a bonafide request


  res.render('./admin/bonafide/bonafide',{bonafide_data});
}

exports.bonafide_approval = async (req,res)=>{
  var ids= req.body.id;
  var title = req.body.title;
   console.log(ids);
 
 
   var change = await bonafide.findOneAndUpdate({ id: ids,bonafide_title:title }, { $set: { approval: true } }, { new: true });
 
   if(change) {
       console.log("Document updated");
       res.redirect('/admin/bonafide_admin')
   } else {
       console.log("No document found with the given id");
   }
  }



// exports.deleteBonafid = async (req, res) => {
//   try {
//     const { postId } = req.params;
//     console.log("poooosttt:",postId);

//     if (!mongoose.Types.ObjectId.isValid(postId)) {
//       return res.status(400).json({ message: "Invalid ObjectId" });
//     }

//     const bonafidePost = await bonafide.findById(postId);
    
//     if (!bonafidePost) {
//       return res.status(404).json({ error: "Bonafide post not found" });
//     }

//     await bonafide.findByIdAndDelete(postId);
    
//     res.redirect("/");
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };
  



// exports.certificate=async (req,res)=>{
//   var bonafide_data=await bonafide.find();

//   res.render('./admin/bonafide/bonafide_certificate',{bonafide_data});
// }