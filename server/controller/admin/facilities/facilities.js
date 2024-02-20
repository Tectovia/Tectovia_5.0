const mongoose = require('mongoose');

exports.hostel=async (req,res)=>{
    res.render("admin/facilities/hostel");
}

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