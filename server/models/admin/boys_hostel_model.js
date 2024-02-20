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
    }
})
const boys_hostel_model=mongoose.model('boys_hostel',boys_hostel_schema);
exports.module=boys_hostel_model
console.log(mongoose.modelNames());