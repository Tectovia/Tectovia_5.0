const { default: mongoose } = require("mongoose")
const circularModel = require('../../models/admin/circular_model')
const messageModel = require('../../models/admin/message_model')



exports.noOfCirculars= async (id)=>{
    let data = await mongoose.model('circular').find()
    let allCirculars = data.filter((item)=>{return ([id] in item.staffs)})
    let unSeenCirculars = data.filter((item)=>{
        return ([id] in item.staffs && item.staffs[id]===false)
        })
    return {
        allCirculars,
        unSeenCirculars
    }
}

exports.noOfNotificationsForStudents = async (rollNo,batch)=>{

    const instructions =await messageModel.find({show:true}) 
    let noOfNotifications ;
    let circular;

    let digitalDairy = instructions.filter((item)=>{
    return (rollNo in item.recievers) 
    })
    
    // console.log("unseen messages");
    // console.log(digitalDairy);

    let seenDigitalDairy = instructions.flatMap((item) =>{
        
         if(rollNo in item.recievers && item.recievers[rollNo] == false) {return item._id}
    })

    let dairyLength = digitalDairy.filter((item)=>{return item.recievers[rollNo] === true}).length

  

    let newTest = await mongoose.model((batch.split('_')[0]+'_test')).findOne({rollno:rollNo})
    newTest = newTest.test_marks.filter((item)=>{
        if(item.updated === true){
            return item
        }
    })

        circular = await mongoose.model('circular').find({classes:{$in:[batch]},delete:false})

        let {seenCirculars} =await mongoose.model(batch).findOne({rollno:rollNo},{seenCirculars:1})

        let unSeenCircular = circular.filter((item)=>{return (!seenCirculars.includes(item._id))})
        noOfNotifications = newTest.length + dairyLength + unSeenCircular.length

    return {
        newTest,
        digitalDairy,
        seenDigitalDairy,
        circular,
        noOfNotifications,
        unSeenCircular
    }
}


exports.yearlyUpdate = async (req,res) =>{
          await circularModel.updateMany({},{$set:{permanent_delete:true,delete:true}})
          await messageModel.updateMany({},{$set:{show : false}})
          res.redirect('/admin/institution_info/common_info')
}