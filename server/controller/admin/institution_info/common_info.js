require('../../../database/database');
const bodyParser = require('body-parser');
const express = require('express');

// Models Here!
const common_info_model = require('../../../models/admin/common_info_model');

// Body-Parser
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

//--------------------  Common_info  -------------------------------

exports.common_info = async (req, res) => {  
    try {
      let item = await common_info_model.findOne({ id: "common_info" })
      if (!item) {
        item = null;
        console.log("No matching document found.");
        res.render("admin/institution_info/common_info",{ item,page_title: "Common Information" });
      } else
         res.render("admin/institution_info/common_info", { item, page_title: "Common Information" });
    } catch (error) {
      console.error("Error:", error);
    }
    
};

exports.submit_common_info = async (req, res) => {
try {
    let imageUploadFile;
    let uploadPath;
    let newImageName;
    
    if(!req.files || Object.keys(req.files).length === 0){
    console.log('No Files where uploaded.');
    } 
    else {
        imageUploadFile = req.files.school_logo;
        newImageName = Date.now() + imageUploadFile.name;
        uploadPath = require('path').resolve('./') + '/public/uploads/instition_info/common_info/' + newImageName;
        console.log(uploadPath);
        
        imageUploadFile.mv(uploadPath, function(err) { 
        if(err) 
            console.log(err);
        })
    }

    const common_info_submit = new common_info_model({
        id: 'common_info',
        school_name: req.body.school_name,
        school_rno: req.body.school_rno,
        school_logo:newImageName,
        school_dob: req.body.school_dob,
        school_address:req.body.school_address,
        school_phone: req.body.school_phone,
        school_email: req.body.school_email,
        board_of_education:req.body.board_of_education,
        medium_of_education:req.body.medium_of_education
    })
    
    await common_info_submit.save();
    console.log('Data submitted Successfully!')
    common_info_model.find({id:"common_info"},function(err, details) {
        if (err) {
            console.log(err);
        } else {
            console.log("Found the following documents:");
            console.log(details);
            res.redirect("/admin/institution_info/common_info");
        }
    });
    } catch (error) {
    // res.json(error);
    console.log('infoErrors', error);
}
};

exports.update_common_info = async (req, res) => {
  try {
    const schoolIdToUpdate = 'common_info';
  
    if(!req.files || Object.keys(req.files).length === 0){
        console.log('No Files where uploaded.');
      } 
      else {
          imageUploadFile = req.files.school_logo;
          newImageName = "school_logo_" + imageUploadFile.name;
          uploadPath = require('path').resolve('./') + '/public/uploads/instition_info/common_info/' + newImageName;
          console.log(uploadPath);
          
          imageUploadFile.mv(uploadPath, function(err) { 
          if(err) 
              console.log(err);
          })
      }

      const updatedInfo = {
        school_name: req.body.school_name,
        school_rno: req.body.school_rno,
        school_logo: newImageName,
        school_dob: req.body.school_dob,
        school_address: req.body.school_address,
        school_phone: req.body.school_phone,
        school_email: req.body.school_email,
        board_of_education: req.body.board_of_education,
        medium_of_education: req.body.medium_of_education,
      };

    // Create an update query
    const query = { id: schoolIdToUpdate };
    const update = { $set: updatedInfo };
  
    //update the document.
    const result = await common_info_model.updateOne(query, update);
  
    if (result.nModified > 0) {
      console.log('Data updated successfully!');
    } else {
      console.log('No records were updated.');
    }
      res.redirect('/admin/institution_info/common_info');
    } 

    catch (error) {
      console.log('Error updating info:', error);
    }
  
};
