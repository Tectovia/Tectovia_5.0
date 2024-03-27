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
  const commoninfo = await common_info_model.find({}, { annual_report: 1 });
  console.log("Annual Reports", commoninfo);

  const annualReports = commoninfo.map(info => info.annual_report);
  console.log(annualReports);
  res.render("admin/institution_info/annual_report", { page_title: "Annual Report", annualReports });    
};
exports.delete_annual_report=async(req,res)=>{
  try {

    const reportId = req.params.id;
    await common_info_model.findByIdAndDelete(reportId);

    const commoninfo = await common_info_model.find({}, { annual_report: 1 });

  const annualReports = commoninfo.map(info => info.annual_report);
  console.log(annualReports);

    res.render('admin/institution_info/annual_report',{ page_title: "Annual Report",annualReports });
  } catch (error) {
    console.error('Error deleting annual report:', error);
    res.status(500).send('Internal Server Error');
  }
}

exports.submit_annual_report = async (req, res) => {
  try {
    let imageUploadFile;
    let newImageName;
    const annual_report_year = req.body.annual_report_year;
    console.log(annual_report_year);
    
    let commoninfo = await common_info_model.findOne();
    console.log("Common information", commoninfo);
    
    if (!commoninfo) {
      commoninfo = new common_info_model();
    }
    
    if (req.files && req.files.annual_report_pdf) {
      imageUploadFile = req.files.annual_report_pdf;
     const path = require("path").resolve("./") + "/public/uploads/common_info";
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
      }
      
      const uploadpath = require("path").resolve("./") + "/public/uploads/common_info/";
      var image_name= image_saver(imageUploadFile,`Annual_report_${annual_report_year}_`, uploadpath);
      
      commoninfo.annual_report.push({
        annual_report_year: annual_report_year,
        annual_report_pdf: image_name
      });
    }
    await commoninfo.save();
    const commoninfos = await common_info_model.find({}, { annual_report: 1 });
    const annualReports = commoninfos.map(info => info.annual_report);
    console.log(annualReports);

    res.render("admin/institution_info/annual_report", { page_title: "Annual Report",annualReports });
  } catch (error) {
    console.log("Internal Error", error);
    res.status(500).send("Internal Server Error");
  }
};