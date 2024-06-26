
const { default: mongoose } = require('mongoose');
const staff_model=require('../../models/admin/staff_information_model')

const {classes_map}=require('../universal_controller/class_map');
const crypto=require("crypto")
let updated;

// used to show circular notification for staff edited by purushothaman @ 27/2
const {noOfCirculars,noOfNotificationsForStudents}=require('../universal_controller/notificationFunction')

let class_model;
let markEntered;

exports.mark_entry_index=async(req,res)=>{

    const staff_id=req.params.id;
    let temp=[]
    const staffdata=await staff_model. find({_id:staff_id},{staff_id:1,time_table:1})
    const time_table=staffdata[0].time_table
    
    await Object.values(time_table).map((item)=>{
        item.map((i)=>{
            if(i.class!=='null'&&i.sec!=='null')
            temp.push(i.class+"-"+i.sec)
        })
    })

    const  temp_classes=Array.from(new Set(temp))

    const classes=[]

   

    for(item of temp_classes){
        classes.push({
            "batch":item.split('_batch')[0],
            "class":classes_map[item.split('_batch')[0]],
            "section":item.split('_batch-')[1]
        })
    }

    // used to show circular notification for staff edited by purushothaman @ 27/2
    let circularNotification = await noOfCirculars(staffdata[0].staff_id)
     // used to show circular notification for staff edited by purushothaman @ 14/3
     circularNotification = circularNotification.unSeenCirculars
     //----------------------------------------------------------------------

    //----------------------------------------------------------------------

    res.render("./staff/mark_entry_index",{
        staffdata,
        classes,
        circularNotification 
    })
   
}

exports.mark_entry=async (req,res)=>{

    const {batch,_id}=req.params;
    const staffdata=await staff_model. find({_id:_id},{_id:1,staff_id:1})

    const handling_class={
        "batch":batch.split('_')[0],
        "class":classes_map[batch.split('_')[0]],
        "section":batch.split('_')[1]
        }

    class_name= handling_class.batch+"_batch"

    class_model=mongoose.model(class_name)    

    const oldTests=await mongoose.model(handling_class.batch+'_test').find({})
    
    const student_details= await class_model.find({id:class_name,section:handling_class.section})

        // used to show circular notification for staff edited by purushothaman @ 27/2
        let circularNotification = await noOfCirculars(staffdata[0].staff_id)
         // used to show circular notification for staff edited by purushothaman @ 14/3
        circularNotification = circularNotification.unSeenCirculars
        //----------------------------------------------------------------------
        //----------------------------------------------------------------------

    res.render("./staff/mark_entry",{
        staffdata,
        "class_data":handling_class,
        student_details,
        markEntered,
        oldTests,
        circularNotification
    })
    markEntered=false;
}

exports.mark_entered=async(req,res)=>{
    let marks=[]
    const {batch,_id}=req.params;
    const {testtile,maxmarks,minmarks}=req.body;
    const classname=batch.split("_")[0]+"_test"
    const test_model=mongoose.model(classname)
    const id=crypto.randomBytes(8).toString('hex')
    var body=[]
    await Object.keys(req.body).filter((item)=>{
        if(item!=="testtile" && item!=="maxmarks" && item!=="minmarks"&& item!=="date")
        return item
     }).forEach((item)=>{
       const test_object= 
       {
            "rollno":item,
            "tests":
            {   
                "id":crypto.randomBytes(8).toString('hex'),
                "date":req.body.date,
                "testtitle":testtile,
                "minimumMark":minmarks,
                "maximumMarks":maxmarks,
                "marks": req.body[item][0],
                "staus": req.body[item][1],
                "updated":true
            }
        }
        body.push(test_object)
     })

     console.log(body);
    
      await body.map(async(item)=>{ 

        var old_test=await test_model.findOne({"rollno":item.rollno},{test_marks:1})
        console.log(old_test);
        var old_test_marks=old_test.test_marks
        
        old_test_marks.push(item.tests)

        await test_model.updateOne(
        {"rollno":item.rollno},
        {$set:{test_marks:old_test_marks,updated:true}}
        )
     })
     markEntered=true;
    res.redirect(`/staff/markentry/viewclass/${_id}/${batch}`)
}
