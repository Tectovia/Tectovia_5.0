let { coachingClassModel } = require('../../../models/admin/coachingClassModel')

exports.addCoaching = async (req,res,next)=>{
    let {courseName,staffsHandling,courseFee} = req.body
    let newCoachingClass = new coachingClassModel({
        courseName:courseName,
        courseFee:courseFee,
        staffsHandling:staffsHandling
    })
    await newCoachingClass.save()
    res.redirect('/admin/facilities/coaching')
}