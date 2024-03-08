const { default: mongoose } = require('mongoose');
const {noOfNotificationsForStudents} = require('../universal_controller/notificationFunction')
exports.studentNotification = async (req,res,next)=>{
    let {_id,batch} = req.params
    let student = await mongoose.model(batch).findOne({_id:_id})
    // console.log(student);
    let notification = await noOfNotificationsForStudents(student.rollno,student.id)
    res.render('./student/notification',{student,notification})
    // res.send("success")

}

exports.dummy1 = async (req,res)=>{
    console.log(req.session.newNotifications);
    res.send("success")
    req.session.newNotifications = null
    console.log('status');
    console.log( req.session.newNotifications);
}