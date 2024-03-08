const { default: te } = require("date-fns/locale/te");
const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");



const date = new Date()




exports.create_test_collection=async (collection_name,schema)=>{

    const new_collection=await mongoose.model(collection_name,schema);

    return  await new_collection
 }

 exports.clearbatch=(batch)=>{

    db.collection(batch).drop()

    console.log(batch+ " deleted");
    
}


var batches=[]
var batch_map={}
var assign=[]

  
  for(i=0;i<12;i++)
  {
  if((date.getMonth()+1)>=6)
  var batch_date=date.getFullYear()-i
  else
  batch_date=date.getFullYear()-1-i
  batches.push((batch_date)+"-"+(batch_date+1)+"_test")
  assign.push((batch_date)+"-"+(batch_date+1)+"_assign")
  }

  batches.map((item,i)=>{
    const test_schema = new mongoose.Schema({
    
        "rollno":{
            type:String
        },
        "batch":{
            type:String
        },
        "section":{
            type:String
        },
        "test_marks":{
            type:Array
        },
        "assignment":[
            {
                ref_id:{
                    type:ObjectId,
                    ref:assign[i]
                },
                mark:{
                   type:Number,
                   default:0 
                },
                status:{
                    type:String,
                    default:'null'
                }
            }
        ] 
    });
    this.create_test_collection(item,test_schema)
  })
   


 
    























