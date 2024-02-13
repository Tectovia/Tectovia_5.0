require('../../database/database');
const { connect } = require('mongoose');
const bodyParser = require('body-parser');
const express = require('express');
const staff_model=require('../../models/admin/staff_information_model');
const { find } = require('../../models/login_data/login_info_model');
const session = require("express-session");
// Body-Parser
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));


exports.staff_index = async (req, res) => { 

    var id=req.params.id;
try{
const data= await staff_model.find({'staff_id':id},{staff_id:1,staff_name:1,class_incharge:1})
       req.session.obj_id= data[0]._id.toString();
        console.log(req.session);

        res.render('staff_index',{'staffdata':data});
}  
catch(err){
        console.log("problem",err);
   }

};


