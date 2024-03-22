const mongoose=require('mongoose')
let date = new Date()
const message_models= new mongoose.Schema({
    "from":{
        type:String
    },
    "date":{
        type:Date,
        default:Date.now()
    },
    "message":{
        type:String
    },
    "recievers":{
        type:Object
    },
    "show":{
        type:Boolean
    },
    "subjects":{
        type:Array
    }
})

const instruction = mongoose.model('messages', message_models);

module.exports = instruction;