require('../../../database/database');
const { connect } = require('mongoose');
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');

// Models Here!
const higher_authority_model = require('../../../models/admin/higher_authority_model');

// Body-Parser
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

//--------------------  Higher_authority  -------------------------------

exports.higher_authority = async (req, res) => {
    higher_authority_model.find( function(err, docs) {
      if (err) {
          console.log(err);
        } else {
          console.log("Found the following documents:");
          console.log(docs);
          res.render("admin/institution_info/higher_authority", { docs, add: "none", edit: 'none', page_title: 'Higher Authority'});
        }
    });
};

exports.submit_higher_authority = async (req, res) => {
    try {
        let imageUploadFile;
        let uploadPath;
        let newImageName;
        
        if(!req.files || Object.keys(req.files).length === 0) {
            console.log('No File Upload!')
        }

        else {
            imageUploadFile = req.files.profile_pic;
            newImageName = Date.now() + imageUploadFile.name;
            uploadPath = require('path').resolve('./') + '/public/uploads/instition_info/higher_authority/' + newImageName;
            console.log(uploadPath);
            imageUploadFile.mv(uploadPath, function(err) {
                if(err) 
                console.log(err);
            })
        }

        const higher_authority_submit = new higher_authority_model({
            id: 'higher_authority',
            sname: req.body.sname,
            name: req.body.name,
            position:req.body.position,
            qualification:req.body.qualification,
            phone:req.body.phone,
            mail:req.body.mail,
            priority:req.body.priority,
            profile_pic:newImageName
        })
        
        await higher_authority_submit.save();
        console.log('Data submitted Successfully!');
        res.redirect('/admin/institution_info/higher_authority');
        } catch (error) {
        // res.json(error);
        console.log('infoErrors', error);
    }
};

exports.update_higher_authority = async (req, res) => {
const doc_id = req.params.id;
try {

    let imageUploadFile;
    let uploadPath;
    let newImageName;

    if(!req.files || Object.keys(req.files).length === 0) {
        console.log("No file were uploaded!");
    } 
    else  {
        console.log("With File")
        imageUploadFile = req.files.profile_pic;
        newImageName = Date.now() + imageUploadFile.name;
        uploadPath = require('path').resolve('./') + '/public/uploads/instition_info/higher_authority/' + newImageName;
        console.log(uploadPath);
        imageUploadFile.mv(uploadPath, function(err) { 
            if(err) 
            console.log(err);
        })
    }

    const higher_authority_submit = {
        id: 'higher_authority',
        sname: req.body.sname,
        name: req.body.name,
        position:req.body.position,
        qualification:req.body.qualification,
        phone:req.body.phone,
        mail:req.body.mail,
        priority:req.body.priority,
        profile_pic:newImageName
    }

    console.log("Here ID : " + doc_id);
    console.log(higher_authority_submit);

    await higher_authority_model.findByIdAndUpdate(doc_id,higher_authority_submit);

    res.redirect("/admin/institution_info/higher_authority");
}
    catch (error) {
    // res.json(error);
    console.log('infoErrors', error);
    }
};

exports.higher_authority_edit = async (req, res) => {
    const doc_id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(doc_id)) {
        return res.status(400).json({ message: 'Invalid ObjectId' });
    }

    try {
        const old = await higher_authority_model.findById(doc_id);
        console.log(old)

        if (!old) {
            return res.status(404).json({ message: 'Data not found' });
        }

        higher_authority_model.find( function(err, docs) {
            if (err) {
                console.log(err);
              } else {
                console.log("Found the following documents:");
                console.log(docs);
                res.render("admin/institution_info/higher_authority", { docs, old,  add: 'none', edit: 'display', page_title: 'Higher Authority'});
              }
        })
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
};

exports.higher_authority_delete = async (req, res) => {
    const doc_id = req.params.id;
    console.log(doc_id);

    if (!mongoose.Types.ObjectId.isValid(doc_id)) {
    return res.status(400).json({ message: 'Invalid ObjectId' });
    }

    try {
        // Find the user by ID and remove it
        const deleted = await higher_authority_model.findByIdAndRemove(doc_id);

        if (!deleted) {
            console.log('Cannot Delete');
        }
        res.redirect("/admin/institution_info/higher_authority");
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
