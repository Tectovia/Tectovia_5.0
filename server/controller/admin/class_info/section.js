require('../../../database/database');
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require("bcrypt");


// Models Here!

const class_model = require('../../../models/admin/section_model');
const login_data = require('../../../models/login_data/login_info_model');
const staff_model = require("../../../models/admin/staff_information_model");
const marksheet_model=require("../../../models/marksheet/marksheet")
const { da } = require('date-fns/locale');
const { date } = require('date-fns/locale');
const { log } = require('util');
const girls_hostel_model = require('../../../models/admin/girls_hostel_model');
const boys_hostel_model = require('../../../models/admin/boys_hostel_model');




// Body-Parser
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

const dayhour=JSON.parse(process.env.DAYHOUR);
  
async function get_staff() {
    try {
      const staff = await staff_model.find({ class_incharge: null });
      return staff;
    } catch (error) {
      throw error;
    }
  }

//------------------- STUDENT FUNCTIONS -------------------

exports.submit_student_basic = async (req, res) => {
    var current_student
    const id = req.params.id;
    const title = req.params.title;
    const section = req.params.section;
    const batch=title.split('_batch')[0];
   // console.log("datas here : ",req.body);

    try {
        
        const StudentModel =await mongoose.model(title);
        const TestModel=mongoose.model(batch+"_test");
        const salt = 10;
        const hashedPassword = await bcrypt.hash(req.body.student_password, salt);

       const data= [
            {
            user_id: req.body.student_rollno,

            password: hashedPassword,
            role: title+"_"+section
           },
           {
            user_id: req.body.student_rollno+"_p",

            password: hashedPassword,
            role: title+"_"+section+"_parent"
           }
        ]
        const saved_data= await login_data.create(data)
            
        var obj_id = saved_data[0]._id;

            if (StudentModel && TestModel) {
                const student_submit = new StudentModel({
                    obj_id: obj_id,
                    id: title,
                    name: req.body.student_name,
                    gender: req.body.gender,
                    rollno: req.body.student_rollno,
                    section: section,
                });

                const student_test_detais=new TestModel({
                    rollno:req.body.student_rollno,
                    batch:batch,
                    section: section,
                    test_marks:[],
                    assignments:[]
                })

                current_student_doc= await student_submit.save();
                
                current_student_test_doc= await student_test_detais.save();
               
                
            } else {
                console.log('Invalid title');
                res.status(400).send('Invalid title');
            }

            
           

      res.redirect(`/view_section/add_student/${id}/${title}/${section}/student_info_personal/${current_student_doc._id}`)
   
    } catch (error) {
        console.log('infoErrors', error);
    }
};

// submit student other Information
exports.submit_student_details = async (req, res) => {
    try {
        const studentId = req.params.stu_id;
        const id = req.params.sec_id;
        const title = req.params.title;
        const section = req.params.section;

        const StudentModel = mongoose.model(title);

        const studentDetails = {
            dob: req.body.dob,
            gender: req.body.gender,
            blood_group: req.body.blood_group,
            phone: req.body.phone,
            emis: req.body.emis,
            father_name: req.body.father_name,
            mother_name: req.body.mother_name,
            address: req.body.address,
            aadhar_no: req.body.aadhar_no,
            nativity: req.body.nativity,
            community: req.body.community,
            email: req.body.email,
            transport_type: req.body.transport_type,
            disability: req.body.disability,
            residence: req.body.residence
        };

        const updatedStudent = await StudentModel.findByIdAndUpdate(studentId, studentDetails, { new: true });

        if (updatedStudent) {
            console.log('Data updated successfully!');
        } else {
            console.log('No records were updated.');
        }

       
        const editStudent = await StudentModel.findById(studentId);

        if (!editStudent) {
            console.log('Student not found');
        } else {
            console.log('Found student:', editStudent);
            if (editStudent.residence === "hostel") {
                console.log('Student has hostel residence. Saving hostel record...');
                if (editStudent.gender === "Male") {
                    try {
                        const boys_hostel_instance = new boys_hostel_model({
                            name: editStudent.name,
                            rollno: editStudent.rollno,
                            class: editStudent.id,
                            gender: editStudent.gender,
                            // student_id: editStudent.id
                        });
                        await boys_hostel_instance.save();
                        console.log('Hostel record for male student saved successfully!');
                    } catch (error) {
                        console.error('Error saving hostel record for male student:', error);
                    }
                } else if (editStudent.gender === "Female") {
                    try {
                       
                        const girls_hostel_instance = new girls_hostel_model({
                            name: editStudent.name,
                            rollno: editStudent.rollno,
                            gender: editStudent.gender,
                            class:editStudent.id
                        });
                        await girls_hostel_instance.save();
                        console.log('Hostel record for female student saved successfully!');
                    } catch (error) {
                        console.error('Error saving hostel record for female student:', error);
                    }
                } else {
                    console.log('Unknown gender. Cannot save hostel record.');
                }
            } else {
                console.log('Student already has a residence');
            }
        }
        

        res.redirect(`/view_section/add_student/${id}/${title}/${section}/student_info_parent/${studentId}`);
    } catch (error) {
        console.error('An error occurred:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
};

// Student parent submission
exports.submit_student_parent = async (req, res) => {
    try {
        const studentId = req.params.stu_id;
        const id = req.params.sec_id;
        const title = req.params.title;
        const section = req.params.section;

        //console.log(title);
        const StudentModel = mongoose.model(title);

        //console.log('Updating document with _id:', studentId);

        const studentDetails = req.body;
      
        updatedStudent= await StudentModel.findByIdAndUpdate(studentId,studentDetails ,{ new: true });

        if (updatedStudent) {
            console.log('Data updated successfully!');
        } else {
            console.log('No records were updated.');
        }
        res.redirect(`/admin/class_info/class_list/view_section/${id}/${title}/${section}`)
       
    } catch (error) {
        console.error('An error occurred:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
};

exports.delete_student = async (req, res) => {
    const _id = req.params._id;
    const title = req.params.title;
    const sec = req.params.section;
    const _sec_id = req.params._sec_id;

    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(400).json({ message: 'Invalid ObjectId' });
    }

    try {

        // Construct a dynamic model variable based on the "title"
        const modelVariable = title.toLowerCase().replace(' ', '_') + '_schema';
        const student_schema = student_model[modelVariable];

        await student_schema.findById(_id).then((student_doc) => {
            login_id = student_doc.obj_id;
            login_data.findByIdAndRemove(login_id).then((deleted) => {
                if (!deleted) {
                    console.log('Cannot Delete');
                } else {
                    console.log("Record Deleted also in Login Data")
                }
            });
        });
 
        const deleted = await student_schema.findByIdAndRemove(_id);
        if (!deleted) {
            console.log('Cannot Delete');
        } else {
            console.log('Student Record Deleted Successfully');
        }
        res.redirect("/admin/class_info/class_list/view_section/"+_sec_id+"/"+title+"/"+sec);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

exports.view_student = async (req, res) => {
    const title = req.params.title || req.data.id;
    const sec = req.params.section || req.data.section;
    const id = req.params._id || req.data._id
    const selectedModel = mongoose.model(title);
    let studentDetails = req.data;
    let edit=false;
    console.log("params");
    console.log(req.params);
    console.log("data");
    console.log(req.data);
    
    if(studentDetails !== undefined){
        edit=true
    }

    const {obj_id} =  await selectedModel.findOne({_id:id},{rollno:1,obj_id:1})  

   

    if (!selectedModel) {
        console.log("Invalid title");
        return res.status(400).send("Invalid title");
    }

        var hash_student_password;

        login_data.find({_id:obj_id}).then(async (login_doc) => {
            hash_student_password = login_doc[0].password;
        selectedModel.findById(id, (err, student_doc) => {
            if (err) {
                console.log(err);
                return res.status(500).send("Error retrieving student document");
            } else {
                res.render("admin/class_info/view_student", { title, sec, id, student_doc, hash_student_password,edit,studentDetails });
            }
        });
    })
}

//------------------- SECTION FUNCTIONS -------------------

exports.edit_section = async (req, res) => {
    const title = req.params.title;
    const sec = req.params.section;
    const id = req.params._id;

    const [section_incharge_name,section_incharge_id]=req.body.section_incharge.split('_');
    const body_data=req.body;
    
  
    body_data['section_incharge_name']=section_incharge_name;
    body_data['section_incharge_id']=section_incharge_id;
    delete body_data['section_incharge'];
 
        
      
        const updated_data= await class_model.findByIdAndUpdate(id,body_data,)
        if(updated_data['section_incharge_id']!=section_incharge_id){
          
            const name=title+"_"+sec;
           
            var new_stf=section_incharge_id;
            var old_stf=updated_data['section_incharge_id'];
        
           staff_model.findOneAndUpdate({staff_id:new_stf},{$set:{class_incharge:name}}).then((data)=>{
            
           });
           staff_model.findOneAndUpdate({staff_id:old_stf},{$set:{class_incharge:'null'}}).then((data)=>{
            console.log('old staff' ,data);
           });
           
        }
        else{
            console.log('NO changes in staff ');
        }
   
   

    res.redirect(`/admin/class_info/class_list/view_section/${id}/${title}/${sec}`)

  
}



//--------------------- EDIT STUDENT PERSONAL DETAILS ----------------------

exports.edit_student=async (req,res,next)=>{
    const {_id,batch}=req.params
    req.data= await mongoose.model(batch).findOne({_id:_id},{})
    next()
}

exports.edit_student_submit = async (req,res,next)=>{
    const {_id,batch}=req.params
    let updatetdData = await mongoose.model(batch).findByIdAndUpdate({_id:_id},req.body,{new:true})
    res.redirect(`/admin/class_info/class_list/view_section/view_student/${updatetdData._id}/${updatetdData.id}/${updatetdData.section}`)
}
