const mongoose=require('mongoose')

const message_models= new mongoose.Schema({
    "from":{
        type:String
    },
    "date":{
        type:String
    },
    "message":{
        type:String
    },
    "recievers":{
        
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