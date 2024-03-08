require('../../database/database');
const { format, eachDayOfInterval } = require("date-fns");
const { connect, default: mongoose } = require('mongoose');
const bodyParser = require('body-parser');
const express = require('express');
const staff_model=require('../../models/admin/staff_information_model');
const date = new Date();
const year = date.getFullYear();
const db=mongoose.connection; 
// Body-Parser
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
const dayhour={
    'day':6,
    'hr':5
}
exports.time_table = async (req, res) => { 
    var id= req.params.id;
    var datetext = format(date, "dd-MM-yyyy");
    const acad_data = await db.collection("academic_calendar").findOne({ year: year });
    const dayorder=acad_data[datetext].dayorder;

    staff_model.find({'_id':id},{time_table:1,staff_id:1,staff_name:1}).then((data)=>{
        console.log(data);
        res.render('staff/time_table',{staffdata:data,dayhour,dayorder});
      })
     .catch(()=>{
        console.log("problem");
     })
};