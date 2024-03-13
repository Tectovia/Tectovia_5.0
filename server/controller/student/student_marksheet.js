const { default: mongoose } = require("mongoose");

// this is to find no of notifications added by purushothaman @ 29/2 7.34 am
const {noOfNotificationsForStudents} = require('../universal_controller/notificationFunction')
//-----------------------------------------------------------------------------


exports.student_marksheet=async (req,res)=>{

    let {id,stdclass,sec}=req.params
    const role=req.originalUrl.toString().split('/')[1]
    const student=await mongoose.model(stdclass).findOne({_id:id})
    stdclass=stdclass.split("_batch")[0]+"_test"
    const testMarks= await mongoose.model(stdclass).findOne({rollno:student.rollno},{test_marks:1,_id:1})

    // this is to find no of notifications added by purushothaman @ 29/2 7.34 am
    let notification = await noOfNotificationsForStudents(student.rollno,student.id)
    //----------------------------------------------------------------------------------

    const data={
        student,
        testMarks,
        role,
        notification
    }

    console.log(req.params);
    res.render("./student/student_test_results",data)
}


exports.studentTesteen = async (req,res)=>{

    let {_id,batch,testId} = req.params
    console.log(req.params);
    const student=await mongoose.model(batch).findOne({_id:_id})
    const testModelName =  batch.split("_batch")[0]+"_test"
    let testMarks= await mongoose.model(testModelName).findOne({rollno:student.rollno})
    
    // console.log('old test');
    // console.log(testMarks);

    testMarks = testMarks.test_marks.map((item)=>{
        if(item.id === testId){
            item.updated = false
            return item
        }else{
            return item
        } 
    })
    // console.log("new test");
    // console.log(testMarks);

    await mongoose.model(testModelName).findOneAndUpdate({rollno:student.rollno},{$set:{"test_marks":testMarks}})

    res.redirect(`/student/testmarks/${student._id}/${student.id}/${student.section}`)

}
