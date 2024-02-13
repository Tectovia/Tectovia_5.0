require('../../database/database');
const { connect } = require('mongoose');
const bodyParser = require('body-parser');
const express = require('express');
const student_contoller=require('../../controller/student/digital_dairy')
const mongoose=require('mongoose');
// Body-Parser
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

const student_model = require("../../models/admin/student_model");
const class_model = require("../../models/admin/section_model");




exports.parent_index = async (req, res) => { 
    const par_id=req.params.id;
    const id=par_id.split('_')[0]
    const cls=req.params.class;
    var [title,batch,sec,role]=cls.split('_');
    title+='_'+batch;
    console.log(title);
    const selected = mongoose.model(title);
    var student=await selected.findOne({rollno:id});
    // req.session.obj_id= student._id.toString();
    // console.log(req.session);
    console.log("id_p"+par_id);
    console.log("title:"+title);
    console.log("section:"+sec);
    console.log("role:"+role);
    // console.log(student);
    res.render('parent_index',{student});
};



