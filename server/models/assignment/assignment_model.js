const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const assignment_schema = new mongoose.Schema({
    title:{
     type:String,
     required:true
    },
    unit:{
        type:String,
        required:true
       },
    sub:{
        type:String,
        required:true
    },
    desc:{
        type:String,
        required:false
    },
    due:{
        type:String,
         required:true
    },
    class:{
        type:String,
        required:true
    },
    sec:{
        type:String,
        required:true
    },
   
  
});

const assignment_model=mongoose.model('assignment',assignment_schema);

module.exports=assignment_model;