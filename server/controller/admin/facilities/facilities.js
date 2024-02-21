const mongoose = require('mongoose');
const { log } = require('util');
const {classes_map}=require('../../universal_controller/class_map');
const {boys_hostel_model}=require('../../../models/admin/boys_hostel_model');
const {girls_hostel_model}=require('../../../models/admin/girls_hostel_model')

//-----------------hostel----------

exports.hostel=async (req,res)=>{
    try {
        let students = {};
        
        // Retrieve the data from the database
        const girlsStudents = await girls_hostel_model.find();
        const boysStudents = await boys_hostel_model.find();
        
        // Assuming you want to display both girls and boys students
        students = {
            girls: girlsStudents,
            boys: boysStudents
        };

        console.log(students);

        // Pass the data to the rendering context and render the page
        res.render('./admin/facilities/hostel', { students ,classes_map});
       // res.send("sucess")
    } catch (error) {
        console.error(error);
        res.render('error');
    }
  
}



exports.addstudents = async (req, res) => {
    try {
        const newDocumentData = {
            name: req.body.name,
            rollno: req.body.rollno,
            class: req.body.class,
            roomnumber: req.body.roomnumber
        };

        let HostelModel;
        if (req.body.gender === 'girls') {
            HostelModel = girls_hostel_model;
        } else if (req.body.gender === 'boys') {
            HostelModel = boys_hostel_model;
        } else {
            throw new Error('Invalid gender');
        }

        const newdoc = new HostelModel(newDocumentData);
        const result = await newdoc.save();
         console.log(result);
        res.redirect("/admin/facilities/hostel");
    } catch (error) {
        console.error(error);
        res.render("error");
    }
};

 
async function saveToHostel(newDocumentData, HostelModel) {
    const newDoc = new HostelModel(newDocumentData);
    const result = await newDoc.save();
    console.log(result);
}


//----------------------------------------

exports.transport=async (req,res)=>{
    res.render("admin/facilities/transport");
}

exports.lab=async (req,res)=>{
    res.render("admin/facilities/lab");
}

exports.library=async (req,res)=>{
    res.render("admin/facilities/library");
}

exports.coaching=async (req,res)=>{
    res.render("admin/facilities/coaching");
}