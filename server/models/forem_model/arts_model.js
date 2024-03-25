const { name } = require('ejs');
const mongoose = require('mongoose')
const schema = mongoose.Schema;


const arts = new schema({
   
    stream: {
        type: String
    },
    question: { type: String, required: true },
    answer:[
        {
            
            Answeredby: { type: String, required: true },
            role:{type: String},
            type: Object,
            verified:{ type: Boolean }, 
        }
    ],

    postedBY: [
        {
            username: { type: String },
            role: { type: String },
            type: Object,
            required: true
        }
    ]
    
   
    
}) 
const arts_model = mongoose.model('public_forem_arts', arts);



module.exports = arts_model;