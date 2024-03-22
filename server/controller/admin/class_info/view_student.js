require('../../../database/database');
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');

// Models Here!
const student_model = require('../../../models/admin/student_model');
const class_model = require('../../../models/admin/section_model');
const { log } = require('util');


// Body-Parser
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));


//------------------- VIEW PARENT -------------------

exports.view_parent= async (req,res)=>{
 
  const {_id,batch}=req.params
  //console.log(req.params);
  const model=mongoose.model(batch)
  const data=await model.findOne({_id:_id},{section:1,id:1,father_img:1,mother_img:1,guardian_img:1,father_name:1,parent_whatsapp:1,mother_name:1,father_aadhar:1,mother_aadhar:1,father_occupation:1 ,mother_occupation:1,father_voter:1, mother_voter:1,guardian_address:1,guardian_whatsapp:1,guardian_alter:1,guardian_name:1,guardian_phone1:1,guardian_phone2:1,income_cer:1, parent_phone1:1, parent_phone2:1,guardian_address:1, parent_alter:1,parent_annual:1})
  console.log(data);
  res.render('./admin/class_info/viewParent',{data,document: "none"})
};
exports.parent_document_view = async (req, res) => {
  const { _id, id } = req.params;
  //console.log("_id, id", _id, id);
    const model = mongoose.model(id);
    const data = await model.findById(_id);
    res.render("admin/class_info/viewParent", {
      data,
      document: "display",
    });
};



exports.edit_parent= async (req,res)=>{
  const {_id,batch} = req.params;
  console.log(req.body);
  const data =await mongoose.model(batch).findByIdAndUpdate({_id},req.body,{new:true})
  console.log(data);
  res.redirect(`/admin/viewParent/${data._id}/${data.id}`)
}
