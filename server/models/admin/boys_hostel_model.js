const mongoose = require("mongoose");


const boys_hostel_schema = new mongoose.Schema({
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
    },
    available:{
        type:Boolean,
        default:true
    },
    gender:{
        type:String
    }
})
const boys_hostel_model=mongoose.model('boys_hostel',boys_hostel_schema);
module.exports =boys_hostel_model
//console.log(mongoose.modelNames());
//exports.boys_hostel_model=boys_hostel_model;