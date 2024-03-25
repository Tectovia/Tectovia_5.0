const { default: mongoose } = require("mongoose")


exports.noOfCirculars= async (id)=>{
    let data = await mongoose.model('circular').find()
    return data.filter((item)=>{
    return ([id] in item.staffs && item.staffs[id]===false)
    })
}

exports.noOfNotificationsForStudents = async (rollNo,batch)=>{

    const instructions =await mongoose.model('messages').find() 
    let noOfNotifications ;
    let circular;

    let digitalDairy = instructions.filter((item)=>{
    return (rollNo in item.recievers) 
    })

    let dairyLength = digitalDairy.filter((item)=>{ return (item.recievers[rollNo]===true ) }).length

    let {circularUpdate} = await mongoose.model(batch).findOne({rollno:rollNo},{circularUpdate:1})

  

    let newTest = await mongoose.model((batch.split('_')[0]+'_test')).findOne({rollno:rollNo})
    newTest = newTest.test_marks.filter((item)=>{
        if(item.updated === true){
            return item
        }
    })
    if(circularUpdate){
        circular = await mongoose.model('circular').find({classes:{$in:[batch]},delete:false})
        noOfNotifications = newTest.length + dairyLength + 1
    }else{
        circular = null
        noOfNotifications = newTest.length + dairyLength
    }

    return {
        newTest,
        digitalDairy,
        circular,
        noOfNotifications
    }
}