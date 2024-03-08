const mongoose = require('mongoose');

const girls_hostel_schema = new mongoose.Schema({
    name: {
        type: String
    },
    student_id: {
        type: String
    },
    rollno: {
        type: String
    },
    class: {
        type: String
    },
    roomnumber: {
        type: String
    },
    available: {
        type: Boolean,
        default: true
    },
    gender: {
        type: String
    }
});

const girls_hostel_model = mongoose.model('girls_hostel', girls_hostel_schema);
module.exports = girls_hostel_model;
