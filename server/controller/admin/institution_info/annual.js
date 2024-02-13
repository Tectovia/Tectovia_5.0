require('../../../database/database');
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');

// Body-Parser
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

exports.annual_report = async (req, res) => {  
  res.render("admin/institution_info/achivements",{ page_title: "Annual Report" });    
};