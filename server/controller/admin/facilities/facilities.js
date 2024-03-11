const mongoose = require('mongoose');
const { log } = require('util');
const {classes_map}=require('../../universal_controller/class_map');
const boys_hostel_model=require('../../../models/admin/boys_hostel_model');
const girls_hostel_model=require('../../../models/admin/girls_hostel_model')

//-----------------hostel----------

exports.hostel=async (req,res)=>{
    try {
        let students = {};
        
        // Retrieve the data from the database
        const girlsStudents = await girls_hostel_model.find({ available: true });
        const boysStudents = await boys_hostel_model.find({ available: true });
        
        
        // Assuming you want to display both girls and boys students
        students = {
            girls: girlsStudents,
            boys: boysStudents
        };

       

        // Pass the data to the rendering context and render the page
        res.render('./admin/facilities/hostel', { students ,classes_map,});
       // res.send("sucess")
    } catch (error) {
        console.error(error);
        res.render('error');
    }
  
}



exports.addstudents = async (req, res) => {
    console.log(req.params);
    try {
        var rollno = req.body.rollno.split('-')[0];

        const newDocumentData = {
            name: req.body.name,
            rollno: rollno,
            class: req.body.class,
            roomnumber: req.body.roomnumber,
            gender: req.body.gender
        };

        let HostelModel;
        if (req.body.gender === 'Female') {
            HostelModel = girls_hostel_model;
        } else if (req.body.gender === 'Male') {
            HostelModel = boys_hostel_model;
        } else {
            throw new Error('Invalid gender');
        }

        console.log(req.body);

        // Check if the student already exists
        const existingStudent = await HostelModel.findOne({ rollno: rollno });

        if (existingStudent) {
            // If the student already exists, update the existing record
            await HostelModel.findOneAndUpdate(
                { rollno: rollno },
                {
                    name: newDocumentData.name,
                    class: newDocumentData.class,
                    roomnumber: newDocumentData.roomnumber,
                    available:"true"
                },
                { new: true }
            );
        } else {
            // If the student doesn't exist, create a new record
            const newdoc = new HostelModel(newDocumentData);
            await newdoc.save();
        }

        // Redirect after adding/updating the student
        res.redirect("/admin/facilities/hostel");

    } catch (error) {
        console.error(error);
        // Handle errors appropriately
    }
}


exports.delete_student = async (req, res) => {
    try {
        const newDocumentData = {
            rollno: req.params.rollno,
            batch: req.params.batch
        };

        console.log(newDocumentData);

        // Assuming mongoose and HostelModel are properly imported
        const MasterStudent = mongoose.model((req.params.batch + "_batch" ));

        // Update the residence field to null in the master database

        
        
        const student = await MasterStudent.findOneAndUpdate(
            { rollno :  req.params.rollno },
            { residence: null },
            { new: true } 
        );

       
        const girl_Student = await girls_hostel_model.findOneAndUpdate(
            { rollno :  req.params.rollno },
            {$set:{ available: false }},
            { new: true } 
        )

        const boy_Student = await boys_hostel_model.findOneAndUpdate(
            { rollno :  req.params.rollno },
            {$set:{ available: false }},
            { new: true } 
        )

        // Create a new HostelModel instance
        // const newdoc = new HostelModel(newDocumentData);
        
        // // Save the new document (if needed)
        // const result = await newdoc.save(); 

        // Redirect to the appropriate page after deletion
        res.redirect("/admin/facilities/hostel");
    } catch (error) {
        // Handle errors appropriately
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};




    exports.edithostel = async (req, res) => {
        console.log(req.body);
    
        try {
            let HostelModel;
            if (req.body.gender === 'Female') {
                HostelModel = girls_hostel_model;
            } else if (req.body.gender === 'Male') {
                HostelModel = boys_hostel_model;
            } else {
                return res.status(400).json({ message: 'Invalid gender provided' });
            }
    
            const { batch, rollno, roomnumber } = req.body;
    
            const updatedStudent = await HostelModel.findOneAndUpdate(
                {rollno}, 
                { $set: { roomnumber } },
                { new: true } 
            );
        
           
        
            res.redirect("/admin/facilities/hostel");
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    };
    




exports.class_find=async (req,res)=>{


    var class_name=req.params.class;
   
    c_name=classes_map[class_name];

    var class_model=mongoose.model(class_name+"_batch");

    var class_data = await class_model.find(
        { residence: { $ne: 'hostel' }, }, 
        { rollno: 1, name: 1, gender: 1 ,residence:1,id:1,}
      );
      //console.log(class_data);

      
    
    let students = {}; 
    
    // Retrieve the data from the database
    const girlsStudents = await girls_hostel_model.find({ available: true });
    const boysStudents = await boys_hostel_model.find({ available: true });
    
    // Assuming you want to display both girls and boys students
    students = {
        girls: girlsStudents,
        boys: boysStudents
    };

    // Pass the data to the rendering context and render the page
    res.render('./admin/facilities/hostel', { students ,classes_map,class_data,class_name});
       

        // Pass the data to the rendering context and render the page
     
 
}

 
async function saveToHostel(newDocumentData, HostelModel) {
    const newDoc = new HostelModel(newDocumentData);
    const result = await newDoc.save();
    console.log(result);
}

//----------------------------------------

exports.transport=async (req,res)=>{
    res.render("admin/facilities/transport");
}

exports.lab=async (req,res)=>{
    res.render("admin/facilities/lab");
}

exports.library=async (req,res)=>{
    res.render("admin/facilities/library");
}

exports.coaching=async (req,res)=>{
    res.render("admin/facilities/coaching");
}