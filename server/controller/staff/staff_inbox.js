const mongoose=require('mongoose')
const circular_model = require('../../models/admin/circular_model');
const staff=require('../../models/admin/staff_information_model')

// used to show circular notification for staff edited by purushothaman @ 27/2
const {noOfCirculars}=require('../universal_controller/notificationFunction')



exports.staff_inbox= async (req,res,next)=>{

    const id=req.params.id;

    const staffdata=await staff.find({_id:id},{})

 
    // used to show circular notification for staff edited by purushothaman @ 27/2
    let circularNotification = await noOfCirculars(staffdata[0].staff_id)
    let circular = circularNotification.allCirculars
     // used to show circular notification for staff edited by purushothaman @ 14/3
    circularNotification = circularNotification.unSeenCirculars
    let unSeenCirculars = circularNotification.map((item)=>{return item._id})
    //----------------------------------------------------------------------
    res.render('staff/staff_inbox',{
        circularNotification,
        staffdata,
        circular,
        unSeenCirculars
    })
}

exports.message_seen = async (req,res,next)=>{
    const {id,_id}=req.params

    const staffdata=await staff.findOne({staff_id:id})
   
    const new_circular=await circular_model.findOne({_id:_id})

    new_circular.staffs[staffdata.staff_id]=true

    await circular_model.findByIdAndUpdate({_id:_id},new_circular)

    res.redirect(`/staff/inbox/${staffdata._id}`)
}
