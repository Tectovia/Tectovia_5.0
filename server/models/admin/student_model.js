const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const { db } = require('./section_model');
const student_master = new mongoose.Schema({
    obj_id: {
        type: String,
    },
    id: {
        type: String
    },

    name: {
        type: String
    },
    gender: {
        type: String
    },
    rollno: {
        type: String
    },
    class:{
        type:String
    },
    section: {
        type: String
    },
    dob: {
        type: String
    },
    blood_group: {
        type: String
    },
    phone: {
        type: String
    },
    father_name: {
        type: String
    },
    mother_name: {
        type: String
    },
    father_img: {
        type: String
    },
    mother_img: {
        type: String
    },
    guardian_name: {
        type: String
    },
    guardian_img: {
        type: String
    },
    guardian_address: {
        type: String
    },
    parent_phone1: {
        type: String
    },
    parent_phone2: {
        type: String
    },
    parent_alter: {
        type: String
    },
    parent_whatsapp: {
        type: String
    },
    guardian_phone1: {
        type: String
    },
    guardian_phone2: {
        type: String
    },
    guardian_alter: {
        type: String
    },
    guardian_whatsapp: {
        type: String
    },
    father_occupation: {
        type: String
    },
    mother_occupation: {
        type: String
    },
    guardian_occupation: {
        type: String
    },
    parent_annual: {
        type: String
    },
    father_aadhar: {
        type: String
    },
    mother_aadhar: {
        type: String
    },
    father_aadhar_img: {
        type: String
    },
    mother_aadhar_img: {
        type: String
    },
    income_cer: {
        type: String
    },
    father_voter: {
        type: String
    },
    mother_voter: {
        type: String
    },
    smart_img: {
        type: String
    },
    emis: {
        type: String
    },
    address: {
        type: String,
    },

    
   
});


// // Create models for each schema
// const batch_2023_2024_schema = mongoose.model('batch_2023-2024', student_master );
// const batch_2022_2023_schema = mongoose.model('batch_2022_2023', student_master);
// const batch_2021_2022_schema = mongoose.model('batch_2021_2022', student_master);
// const batch_2020_2021_schema = mongoose.model('batch_2020_2021', student_master);
// const batch_2019_2020_schema = mongoose.model('batch_2019_2020', student_master);
// const batch_2018_2019_schema = mongoose.model('batch_2018_1019', student_master);
// const batch_2017_2018_schema = mongoose.model('batch_2017_2018', student_master);
// const batch_2016_2017_schema = mongoose.model('batch_2016_2018', student_master);
// const batch_2015_2016_schema = mongoose.model('batch_2015_2016', student_master);
// const batch_2014_2015_schema = mongoose.model('batch_2014_2015', student_master);
// const batch_2013_2014_schema = mongoose.model('batch_2013_2014', student_master);
// const batch_2012_2011_schema = mongoose.model('batch_2012_2011', student_master);



// module.exports = {
//     batch_2023_2024_schema,
//     batch_2022_2023_schema,
//     batch_2021_2022_schema,
//     batch_2020_2021_schema,
//     batch_2019_2020_schema,
//     batch_2018_2019_schema,
//     batch_2017_2018_schema,
//     batch_2016_2017_schema,
//     batch_2015_2016_schema,
//     batch_2014_2015_schema,
//     batch_2013_2014_schema,
//     batch_2012_2011_schema
// };
create_student_collection=async (collection_name)=>{

    const new_collection=await mongoose.model(collection_name,student_master);

 }






var date=new Date()
var batches=[]



for(i=0;i<12;i++)
{
if((date.getMonth()+1)>=6)
var batch_date=date.getFullYear()-i
else
batch_date=date.getFullYear()-1-i
batches.push((batch_date)+"-"+(batch_date+1)+'_batch')
}

for (var item of batches){
 const new_collection= create_student_collection(item);

}

// console.log(mongoose.modelNames());

// const studentdetails= mongoose.model("studentdetails",student_master);


// module.exports = studentdetails;
