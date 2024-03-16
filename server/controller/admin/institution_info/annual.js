require('../../../database/database');
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const fs = require("fs");
const image_saver = require("../../universal_controller/image_saver");

// Models Here!
const common_info_model = require('../../../models/admin/common_info_model');
const { log } = require('console');

// Body-Parser
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

exports.annual_report = async (req, res) => {  
  const commoninfo= await common_info_model.find();
  console.log("Common information",commoninfo);

  res.render("admin/institution_info/annual_report",{ page_title: "Annual Report",commoninfo});    
};
exports.submit_annual_report = async (req, res) => {
  try {
    let imageUploadFile;
    let newImageName;
    const annual_report_year = req.body.annual_report_year;
    console.log(annual_report_year);
    
    // Find the common info document
    let commoninfo = await common_info_model.findOne();
    console.log("Common information", commoninfo);
    
    // Handle the case when commoninfo is null or undefined
    if (!commoninfo) {
      commoninfo = new common_info_model();
    }
    
    // Handle file upload
    if (req.files && req.files.annual_report_pdf) {
      imageUploadFile = req.files.annual_report_pdf;
      const currentYear = new Date().getFullYear();
      newImageName = annual_report_year + '_' + imageUploadFile.name; // Concatenate year with filename
      
      const path = require("path").resolve("./") + "/public/uploads/common_info";
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
      }
      
      const uploadpath = require("path").resolve("./") + "/public/uploads/common_info/";
      image_saver(req.files.annual_report_pdf, newImageName, uploadpath); // Pass the concatenated filename
      
      // Push the new annual report object into the annual array
      commoninfo.annual_report.push({
        year: annual_report_year,
        file: newImageName
      });
    }

    // Save the updated common info document
    await commoninfo.save();

    res.render("admin/institution_info/annual_report", { page_title: "Annual Report" });
  } catch (error) {
    console.log("Internal Error", error);
    // Handle error response here
    res.status(500).send("Internal Server Error");
  }
};





// // annaual:[
  //  {
  //   year:2024,
  //   file:this.annual_report.pdf
  //  },
    //  {
  //   year:2025,
  //   file:this.annual_report.pdf
  //  }
// ]