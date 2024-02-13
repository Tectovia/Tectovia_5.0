const mongoose = require('mongoose');

const common_info_schema = new mongoose.Schema({
    id: {
        type: String
    },

    school_name: {
        type: String
    },
    school_rno: {
        type: String
    },

    school_logo: {
        type: String
    },

    school_dob: {
        type: String
    },

    school_address: {
        type: String
    },

    school_phone: {
        type: Number
    },

    school_email: {
        type: String
    },

    board_of_education: {
        type: String
    },

    medium_of_education: {
        type: String
    }
});

const common_info = mongoose.model('common_info', common_info_schema);

module.exports = common_info;