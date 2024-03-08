const staff_data_model=require('../../../models/admin/staff_information_model')
const class_data=require('../../../models/admin/section_model');
const mongoose = require('mongoose');
const { getDate, getMonth, getYear, getTime } = require('date-fns');
const circular_model=require('../../../models/admin/circular_model')
const {classes_map} =require("../../universal_controller/class_map");
let lastVisited;



exports.circular_management = async (req,res) => {

    const staff_data = await staff_data_model.find({available:true},{staff_id:1,staff_designation:1});

    const circular = await circular_model.find()

    let sent_circular= await circular.filter((item)=>{
      return item.permanent_delete===false && item.delete===false
    })

    const archieved_circular= await circular.filter((item)=>{
      return item.permanent_delete===false && item.delete===true
    })

    let class_info = await class_data.find({},{id:1})
    
     class_info=class_info.map((item)=> {return item.id})

    class_info=Array.from(new Set(class_info))

    class_info=class_info.map((item)=>{

      return {
        "class":classes_map[item.split("_batch")[0]],
        "batch":item
      }
    })

    let show=false
    let editCircular={
    "date" : null,
    "title" : null,
    "from" : null,
    "message" : null,
    "staffs" : null,
    "classes": null
    }

    if (req.data !== undefined){
      editCircular = req.data
      show = true
    }


      const data={
        staff_data,
        sent_circular,
        archieved_circular,
        class_info,
        editCircular,
        show,
        lastVisited
      }


    res.render("admin/circular_management", data) 

    lastVisited=null

  };

exports.message_sent= async (req,res,next)=>{

  
  const title = req.body.title;
  const from = req.body.from;
  const message = req.body.message;
  const classes = req.body.classes;
  const staff = req.body.staff;

  const circular= new circular_model({
    "title" : title,
    "from" : from,
    "message" : message,
    "staffs" : {},
    "classes":classes
  });
  if(classes){
  if(Array.isArray(classes)){
  classes.map(async (item)=>{
    await mongoose.model(item).updateMany({circularUpdate:true})
  })}
  else{
    await mongoose.model(classes).updateMany({circularUpdate:true})
  }
  }
  

  Array.isArray(staff)?
  staff.map((item)=>{
    circular.staffs[item]=false;
  }):
  circular.staffs[staff]=false;
  circular.save();
  lastVisited='sent'

  res.redirect("/admin/circular");
 
}


exports.message_archive = async (req,res)=>{
  const {_id}=req.params

  let staffs = await circular_model.findOne({_id:_id},{_id:0,staffs:1})
  let new_staff_object={}
  Object.keys(staffs.staffs).map((item)=>{
      new_staff_object[item]=true
  })

  await circular_model.updateOne({_id:_id},{$set:{delete:true,staffs:new_staff_object}})

  res.redirect("/admin/circular");
}

exports.message_delete=async (req,res)=>{

  const {_id}=req.params
  let staffs = await circular_model.findOne({_id:_id},{_id:0,staffs:1})
  let new_staff_object={}
  Object.keys(staffs.staffs).map((item)=>{
      new_staff_object[item]=true
  })

  await circular_model.updateOne({_id:_id},{$set:{delete:true,permanent_delete:true,staffs:new_staff_object}})

  res.redirect("/admin/circular");

}

exports.message_edit = async (req,res,next)=>{

  req.data = await circular_model.findOne({_id:req.params._id})
  console.log(req.data);
  next()

}

exports.message_editSubmission = async (req,res)=>{

  const title = req.body.title;
  const from = req.body.from;
  const message = req.body.message;
  const classes = req.body.classes;
  const staff = req.body.staff;

  const circular={
    "title" : title,
    "from" : from,
    "message" : message,
    "staffs" : {},
    "classes":classes
  };

  Array.isArray(staff)?
  staff.map((item)=>{
    circular.staffs[item]=false;
  }):
  circular.staffs[staff]=false;

  await circular_model.updateOne({_id:req.params._id},{$set:{
    title:circular.title,
    from:circular.from,
    message:circular.message,
    staffs:circular.staffs,
    classes:circular.classes
  }})

 res.redirect("/admin/circular");

} 

console.log(lastVisited);

