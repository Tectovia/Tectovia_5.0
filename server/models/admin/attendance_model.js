const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const attendance_schema = new mongoose.Schema({},{strict:false});

const date = new Date()


create_attend_collection=async (collection_name)=>{

    const new_collection=await mongoose.model(collection_name,attendance_schema);
 }

var batches=[]
  var batch_map={}
  
  for(i=0;i<12;i++)
  {
  if((date.getMonth()+1)>=6)
  var batch_date=date.getFullYear()-i
  else
  batch_date=date.getFullYear()-1-i
  batches.push((batch_date)+"-"+(batch_date+1)+"_attendance")
  }

  batches.map((item)=>{
    create_attend_collection(item);
  })
