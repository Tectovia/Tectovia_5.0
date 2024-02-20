const mongoose = require('mongoose');
const { log } = require('util');
const {classes_map}=require('../../universal_controller/class_map');
const boys_hostel=require('../../../models/admin/boys_hostel_model')

//-----------------hostel----------

exports.hostel=async (req,res)=>{
    res.render("admin/facilities/hostel",{classes_map});
}
exports.addstudents=async(req,res)=>{
     const {gender}=req.params
     const {name}=req.body
     console.log(req.body);
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