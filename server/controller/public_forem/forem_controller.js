require('../../database/database')
const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const mongoose = require('mongoose')
app.use(bodyParser.urlencoded({ extended: false }));

const arts_model = require('../../models/forem_model/arts_model');

const science_model = require('../../models/forem_model/science_model');

const { classes_map } = require('../universal_controller/class_map');

const staff_model = require('../../models/admin/staff_information_model');
//const staff_model=require('../../models/admin/staff_information_model');
// this is to find no of notifications added by purushothaman @ 29/2 7.34 am
const { noOfNotificationsForStudents } = require('../universal_controller/notificationFunction')
const {noOfCirculars}=require('../universal_controller/notificationFunction')

//-----------------------------------------------------------------------------

//Forem MainPage
exports.mainPageStudent = async (req, res) => {
    // var id = req.params.id;

    // if (req.session.role == 'staff') {
        
    // }
    // else if (req.session.role == 'admin') {
        
    // }
    // else {

    // }
    // res.render('public_forem/forem_main',{title:"Forum",user:req.session.user_id,role: req.session.role})

    let [, role] = req.originalUrl.toString().split("/")
console.log('BHJMKlm',role);
    if (role === 'student') {
        let { _id, batch } = req.params
        console.log(batch,_id,'fhdjklsk');
       
        let student =await mongoose.model(batch).findOne({ _id: _id })

        // this is to find no of notifications added by purushothaman @ 29/2 7.34 am
        let notification = await noOfNotificationsForStudents(student.rollno,student.id)
        //----------------------------------------------------------------------------------
        res.render('public_forem/forem_main',{title:"Forum",user:student.rollno,role,student,notification})
        
    }
}

exports.mainPageStaff = async (req, res) => {
    console.log('tata');

    var id= req.params._id;
console.log(id);
    try{
    const data= await staff_model.find({_id:id},{staff_id:1,staff_name:1,class_incharge:1})
    console.log(data);
    //req.session.obj_id= data[0]._id.toString();
        staff_name = data[0].staff_name.toString();
        let circularNotification = await noOfCirculars(id)
        console.log(data);

    res.render('public_forem/forem_main',{'staffdata':data,circularNotification,title:"Forum",user:staff_name,role: req.session.role});

}  
catch(err){
    console.log("problem",err);
}


}
exports.mainPageAdmin = async (req, res) => {
    
    let role = req.session.role;
    let user = req.session.user_id;
    res.render('public_forem/forem_main', { role, user });
}

//Redirecting procedure from arts or science forem main page to main page its not that compilcated 

exports.redirecting = async (req, res) => {
    let { rollno, batch } = req.params;
    console.log(rollno , batch);
    value = batch.split('_');
    var batche = value[0] + '_' + value[1];
    // ex: 2023-2024_batch => batche
    console.log(batche);

    var student_model = mongoose.model(batche);
    var student = await student_model.findOne({ 'rollno': rollno }, { name: 1, section: 1, _id: 1 })
    console.log(student);
res.redirect(`/student/forem/index/${student._id}/${batche}`)

}
exports.redirectingStaff = async (req, res) => {
    console.log('hello');
    id = req.session.user_id;
    var data = await staff_model.findOne({ staff_id: id }, { _id: 1 }); // Use findOne instead of find to get a single document
    if (data) {
        console.log(data._id);
        var ids = data._id.toString();
        console.log('bye bye');// Extract _id from the data object
      res.redirect(`/staff/forem/index/${ids}`); // Remove the colon before _id
    } else {
        // Handle case where no document is found for the given staff_id
        res.status(404).send("User not found");
    }
    
}



// ******** End of Main Page  **********

//Forem Selection Section


//Arts page



//User Page
exports.UserQuestion = async (req, res) => {
    console.log('Hello UserQuestion');

    var postedby = '';
    var role = req.session.role;
    if (role !== "staff" && role !== 'admin') {
        var blah = role.split('_');
        
        // var class_name = year + "_" + batch;
        var class_name = blah[0]+ "_" + blah[1];
        console.log('dvfnhvf',class_name);
        var student_model = mongoose.model(class_name);
        var student = await student_model.findOne({ 'rollno': req.session.user_id }, { name: 1,section:1, _id: 0 })
      
        postedby = student.name;
        var section = classes_map[blah[0]];
        console.log(section);
        role = req.session.user_id+" "+'('+section+')';
       
    }
    else if(role == 'admin'){
        postedby = req.session.user_id.toUpperCase();
    }
    else {
        var findStaff = await staff_model.findOne({ 'staff_id': req.session.user_id }, { staff_name: 1 });
        console.log(findStaff.staff_name);
        postedby = findStaff.staff_name;
    }
    var value = [];
    console.log('Posted by : ',postedby);
    var arts_questions = await arts_model.find({ postedBY: { $elemMatch: { username: postedby } } });

    console.log(arts_questions);
    value = value.concat(arts_questions); // Assign the concatenated array back to value
   
    var science_questions= await science_model.find({ postedBY: { $elemMatch: { username: postedby } } });
    value = value.concat(science_questions); // Assign the concatenated array back to value
    
    console.log(value);
    res.render('public_forem/forem_user',{value,user:req.session.user_id,role: req.session.role})
}


//           **** End Of Opening Pages ****

//     -------------------------------------   //

// Question Posting





