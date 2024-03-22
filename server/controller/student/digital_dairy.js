
const message_model=require('../../models/admin/message_model')
const student_model = require("../../models/admin/student_model");
const circular = require('../../models/admin/circular_model');
// this is to find no of notifications added by purushothaman @ 29/2 7.34 am
const {noOfNotificationsForStudents}= require('../universal_controller/notificationFunction')
//-----------------------------------------------------------------------------
const mongoose=require('mongoose')

exports.student_dairy=async (req,res)=>{
    
    const _id=req.params.id;
    const class_titile=req.params.title;
    const section=req.params.sec;
    const role=req.originalUrl.toString().split('/')[1]
    
    const classModel=mongoose.model(class_titile)
    
    const student = await classModel.findOne({_id:_id}).then((data)=>{
        return data
    })

    // this is to find no of notifications added by purushothaman @ 29/2 7.34 am
    let notification = await noOfNotificationsForStudents(student.rollno,student.id)
    let instructions = notification.digitalDairy
    let seenInstructions = notification.seenDigitalDairy
    //-----------------------------------------------------------------------------

    res.render("./student/digital_dairy",{
        student,
        instructions,
        notification,
        seenInstructions,
        role
    })
}


exports.studentSeenCircular = async (req,res,next)=>{
    let {circularId,studentId,batch} = req.params
    const role=req.originalUrl.toString().split('/')[1]
    let student = await mongoose.model(batch).findOne({_id:studentId})
    
    // this is to find no of notifications added by purushothaman @ 29/2 7.34 am
    let notification = await noOfNotificationsForStudents(student.rollno,student.id)
    const datas = notification.circular

    

    let newCircular = await mongoose.model('circular').findById(circularId)
    await mongoose.model(batch).findByIdAndUpdate({_id:studentId},{$push:{
        seenCirculars : circularId
    }}).then(()=>{
        console.log('updated');
    })
    res.render('./student/studentNewCircular',{student,role,datas,notification,newCircular})
}



exports.instructionSeen = async (req,res) =>{
    let {_id,batch,instructionId} = req.params;
    let student = await mongoose.model(batch).findById(_id)
    let {recievers} = await message_model.findById({_id:instructionId},{recievers:1})

    recievers[student.rollno]=false
    console.log(recievers);
    await message_model.findByIdAndUpdate({_id:instructionId},{recievers})
    res.redirect(`/student/dairy/${student._id}/${student.id}/${student.section}`);
}


exports.student_circular=async(req,res)=>{
    let {id,title}=req.params;
    const role=req.originalUrl.toString().split('/')[1]
    const class_model= mongoose.model(title)

    const student=await class_model.findOne({_id:id})

     // this is to find no of notifications added by purushothaman @ 29/2 7.34 am
    let notification = await noOfNotificationsForStudents(student.rollno,student.id)
    const datas = notification.circular
     //-----------------------------------------------------------------------------
     await class_model.findOneAndUpdate({_id:id},{circularUpdate:false})
     
    res.render('./student/student_circular',{student,role,datas,notification})

}