require('../../database/database');
const { connect } = require('mongoose');
const bodyParser = require('body-parser');
const express = require('express');
const staff_model=require('../../models/admin/staff_information_model');

// Body-Parser
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
const dayhour={
    'day':6,
    'hr':5
}
exports.time_table = async (req, res) => { 
    var id= req.params.id;
  
    staff_model.find({'_id':id},{time_table:1,staff_id:1,staff_name:1}).then((data)=>{
        console.log(data);
        res.render('staff/time_table',{staffdata:data,dayhour});
      })
     .catch(()=>{
        console.log("problem");
     })
};