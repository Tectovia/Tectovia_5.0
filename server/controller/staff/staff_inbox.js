const mongoose=require('mongoose')
const circular_model = require('../../models/admin/circular_model');
const staff=require('../../models/admin/staff_information_model')




exports.staff_inbox= async (req,res,next)=>{

    const id=req.params.id;

  const staffdata=await staff.find({_id:id},{})

    // console.log(staffdata);

   const data =await circular_model.find({})

//    console.log(data);

   const circular = data.filter((item)=>{
    return ([staffdata[0].staff_id] in item.staffs && item.staffs[staffdata[0].staff_id]===false)
   })

    res.render('staff/staff_inbox',{
        staffdata:staffdata,
        circular:circular,
        staff_id:id
    })
}

exports.message_seen = async (req,res,next)=>{
    const id=req.params.id;
    const date=req.params.date;

    const staffdata=await staff.findOne({_id:id},{staff_id:1})
   
    const new_circular=await circular.findOne({date:date})

    new_circular.staffs[staffdata.staff_id]=true

    await circular.findOneAndUpdate({date:date},new_circular)


    res.redirect('/staff/inbox/'+id)
}
