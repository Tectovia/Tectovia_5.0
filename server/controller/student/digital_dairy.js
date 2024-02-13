
const message_model=require('../../models/admin/message_model')
const student_model = require("../../models/admin/student_model");
const circular = require('../../models/admin/circular_model');
const mongoose=require('mongoose')

exports.student_dairy=async (req,res,next)=>{
    
    const roll_no=req.params.id;
    const class_titile=req.params.title;
    const section=req.params.sec;
    const role=req.originalUrl.toString().split('/')[1]
    // console.log("roll_no-"+roll_no);
    // console.log("class_titile-"+class_titile);
    // console.log("section-"+section);
    // console.log("URL-"+role);

    const student=mongoose.model(class_titile)
    
    const student_data=await student.findOne({"rollno":roll_no}).then((data)=>{
        return data
    })

    const temp_instructions=await message_model.find()
    const instructions= temp_instructions.filter((item)=>{
        return (roll_no in item.recievers && item.recievers[roll_no]!==false)
    })
    console.log(instructions);

    res.render("./student/digital_dairy",{
        "student":student_data,
        "instructions":instructions,
        "role":role
    })
}


exports.student_circular=async(req,res)=>{
    let {id,title}=req.params;
    const role=req.originalUrl.toString().split('/')[1]
    const class_model= mongoose.model(title)

   
    const datas=await circular.find({classes:{$in:[title]},delete:false})
    console.log(datas);

    const student=await class_model.findOne({"rollno":id})
    
    res.render('./student/student_circular',{student,role,datas})

}