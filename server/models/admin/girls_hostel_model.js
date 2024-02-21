const mongoose = require("mongoose");


const girls_hostel_schema = new mongoose.Schema({
    name:{
        type:String
    },
    student_id:{
        type:String
    },
    rollno:{
        type:String
    },
    class:{
        type:String
    },
    roomnumber:{
        type:String
    }
})
const girls_hostel_model=mongoose.model('girls_hostel',girls_hostel_schema);
exports.girls_hostel_model=girls_hostel_model;
//console.log(mongoose.modelNames());