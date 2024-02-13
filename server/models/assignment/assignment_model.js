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
    staff_id:{
        type:String
    },
    source:[
    {
     type:Object
    }
   ]
   
  
});

const date = new Date()


exports.create_assign_collection=async (collection_name)=>{

    const new_collection=await mongoose.model(collection_name,assignment_schema);

    return  await new_collection
 }

var batches=[]
  var batch_map={}
  
  for(i=0;i<12;i++)
  {
  if((date.getMonth()+1)>=6)
  var batch_date=date.getFullYear()-i
  else
  batch_date=date.getFullYear()-1-i
  batches.push((batch_date)+"-"+(batch_date+1)+"_assign")
  }

  batches.map((item)=>{
    this.create_assign_collection(item)
  })
