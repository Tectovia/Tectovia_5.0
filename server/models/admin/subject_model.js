const mongoose = require('mongoose');

const subject_schema = new mongoose.Schema({
    id: {
        type: String
    },
    subject_name: {
        type: String
    },
    subject_code: {
        type: String
    },
    subject_medium: {
        type: String
    },
    syllabus:[{
        subject_syllabus:{
            type: String,
        },
        subject_syllabus_year:{
            type:Number,
        },
        subject_syllabus_pdf:{
            type: String,
        },
        study_meterial_pdf:[{
            type:String
        }]
    }],
});

const class_list = mongoose.model('subject_list', subject_schema);

module.exports = class_list;