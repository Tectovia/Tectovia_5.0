require('../../database/database');
const { connect, default: mongoose } = require('mongoose');
const bodyParser = require('body-parser');
const express = require('express');
const circular_model = require('../../models/admin/circular_model');
const staff_model=require('../../models/admin/staff_information_model');
const { find } = require('../../models/login_data/login_info_model');
const session = require("express-session");
const {noOfCirculars}=require('../universal_controller/notificationFunction')
// Body-Parser
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));


exports.staff_index = async (req, res) => { 

    var id=req.params.id;

        try{
        const data= await staff_model.find({'staff_id':id},{staff_id:1,staff_name:1,class_incharge:1})

        req.session.obj_id= data[0]._id.toString();

        let circularNotification = await noOfCirculars(id)

        res.render('staff_index',{'staffdata':data,circularNotification});

}  
catch(err){
        console.log("problem",err);
   }

};

