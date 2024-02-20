const mongoose = require('mongoose');

exports.view_infrastructure=async (req,res)=>{
    res.render("admin/infrastructure/view_infrastructure");
}