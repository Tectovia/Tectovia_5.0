const mongoose=require('mongoose');

const coachingSchema = new mongoose.Schema({
    courseName :{
        type : String
    },
    courseFee :{
        type : String
    },
    staffsHandling :{
        type : String
    }
})

exports.coachingClassModel = mongoose.model("coachingClass",coachingSchema)