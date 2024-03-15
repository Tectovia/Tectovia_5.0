const instruction=require("../../models/admin/message_model")
const staffs=require('../../models/admin/staff_information_model')
const student_model = require("../../models/admin/student_model");
const staff_model= require('../../models/admin/staff_information_model')
const {classes_map}=require("../../controller/universal_controller/class_map");
const { default: mongoose } = require("mongoose");
const message_model=require('../../models/admin/message_model')
let lastVisited;

// used to show circular notification for staff edited by purushothaman @ 27/2
const {noOfCirculars}=require('../universal_controller/notificationFunction')


exports.instruction=async (req,res,next)=>{
    const staff_id=req.params.id;
    const staffdata=await staffs.find({_id:staff_id},{staff_id:1,time_table:1})
    const oldMessage = await message_model.find({from:staffdata[0].staff_id,show:true})

      // used to show circular notification for staff edited by purushothaman @ 27/2
      let circularNotification = await noOfCirculars(staffdata[0].staff_id)
       // used to show circular notification for staff edited by purushothaman @ 14/3
    circularNotification = circularNotification.unSeenCirculars
    //----------------------------------------------------------------------
      //----------------------------------------------------------------------

    let temp=[]
    
    const time_table=staffdata[0].time_table
    
    Object.values(time_table).map((item)=>{
        item.map((i)=>{
            if(i.class!=='null'&&i.sec!=='null')
            temp.push(i.class+"_"+i.sec)
        })
    })

   
    const classes=Array.from(new Set(temp)).map((item)=>{
      return {
        "batch":item.split("_")[0],
        "class":classes_map[item.split("_")[0]],
        "section":item.split("_")[2]
      }
    })

    
    
    temp=[]

    Object.values(time_table).map((item)=>{
      item.map((i)=>{
        if(i.sub!=='null'){
          temp.push(i.sub)
        }
      })
    })

    const subjects=Array.from(new Set(temp))
   
    let allStudents=[]
    
    for(let i=0;i<classes.length;i++)
    {
        let student_model=mongoose.model(classes[i].batch+"_batch") 
        allStudents.push({
          batch:classes[i].batch,
          section:classes[i].section,
          students:await student_model.find({section:classes[i].section},{_id:0,rollno:1}),
        })
    }

    const data={
      staffdata,
      classes,
      allStudents,
      subjects,
      oldMessage,
      lastVisited,
      circularNotification
  }

   res.render('./staff/staff_instructions.ejs',data)

    lastVisited=null
}


exports.instruction_send=async (req,res,next)=>{
    lastVisited='sent'
    const staff= await staff_model.findOne({_id:req.params.id},{staff_id:1})
    const staff_instruction=req.body.instruction;
    const recievers=req.body.recievers;
    const subjects=req.body.subjects;

    console.log(req.body);
    
    
    let objdate1= new Date()
    let date=objdate1.getDate()+'-'+(objdate1.getMonth()+1)+'-'+objdate1.getFullYear()+" "+objdate1.getHours()+":"+objdate1.getMinutes()+":"+
    objdate1.getSeconds()+":"+objdate1.getMilliseconds()
  
  const new_instruction= new instruction({
    "from":staff.staff_id,
    "date":date,
    "message":staff_instruction,
    "recievers":{
      default:true
    },
    "show":true,
    "subjects":subjects
  })

if(Array.isArray(recievers)){
  recievers.map((item)=>{
    new_instruction.recievers[item]=true
  })
}
else {
  new_instruction.recievers[recievers]=true
}
  
  new_instruction.save()
  res.redirect(`/staff/instructions/${staff._id}`);

   // res.send("sucess")
}


exports.deleteInstruction= async (req,res)=>{
  const {id,staffId}=req.params
  await instruction.updateOne({_id:id},{$set:{show:false}})
  res.redirect(`/staff/instructions/${staffId}`);
}



