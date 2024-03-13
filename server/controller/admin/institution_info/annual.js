require('../../../database/database');
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const fs = require("fs");
const image_saver = require("../../universal_controller/image_saver");
// Body-Parser
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

exports.annual_report = async (req, res) => {  
  res.render("admin/institution_info/annual_report",{ page_title: "Annual Report" });    
};
exports.submit_annual_report=async(req,res)=>{
  try{
    let imageUploadFile;
    let uploadPath;
    let newImageName;
    if(!req.files || Object.keys(req.files).length === 0){
      console.log('No Files where uploaded.');
      }
      else {
        imageUploadFile = req.files.annual_report_pdf;
        newImageName = Date.now() + imageUploadFile.name;
        var path =require("path").resolve("./") +"/public/uploads/common_info";
    if (!fs.existsSync(path)) {
       fs.mkdirSync(path);
     }
  var uploadpath =  require("path").resolve("./")+"/public/uploads/common_info/";
  if (req.files) {
    if (req.files.annual_report_pdf)
       image_saver(req.files.annual_report_pdf,"annual", uploadpath);
  }
 }     
 res.render("admin/institution_info/annual_report",{ page_title: "Annual Report" });
  }catch (error){
    console.log("Internal Erroor",error);
  }
};
