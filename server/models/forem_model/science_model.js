const mongoose = require("mongoose")

const schema = mongoose.Schema;

const scie = new schema({
    
    stream: {
        type: String
    },
    question: { type: String, required: true },
    answer: [
        {
            AnsweredBy: { type: String, required: true },
            role:{type: String},
            type: Object,
            verified : {type: Boolean}
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

const forem_science = mongoose.model('public_forem_science',scie)
module.exports = forem_science