const { default: mongoose } = require("mongoose");

exports.student_marksheet=async (req,res)=>{

    let {id,stdclass,sec}=req.params
    const role=req.originalUrl.toString().split('/')[1]
    const student=await mongoose.model(stdclass).findOne({_id:id})
    stdclass=stdclass.split("_batch")[0]+"_test"
    const testMarks= await mongoose.model(stdclass).findOne({rollno:student.rollno},{test_marks:1,_id:1})
    const data={
        student,
        testMarks,
        role
    }

    console.log(testMarks);

    console.log(req.params);
    res.render("./student/student_test_results",data)
}