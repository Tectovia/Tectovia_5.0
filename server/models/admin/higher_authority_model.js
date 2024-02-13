const mongoose = require('mongoose');

const higher_authority_schema = new mongoose.Schema({
    id: {
        type: String,
        required: 'This field is required.'
    },

    sname: {
        type: String,
        required: 'This field is required.'
    },

    name: {
        type: String,
        required: 'This field is required.'
    },

    position: {
        type: String,
        required: 'This field is required.'
    },

    qualification: {
        type: String,
        required: 'This field is required.'
    },

    phone: {
        type: String,
        required: 'This field is required.'
    },

    mail: {
        type: String,
        required: 'This field is required.'
    },

    priority: {
        type: String,
        required: 'This field is required.'
    },

    profile_pic: {
        type: String
    }

});

const higher_authority = mongoose.model('higher_authority', higher_authority_schema);

module.exports = higher_authority;