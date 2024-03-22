const mongoose=require('mongoose')

const circular_model= new mongoose.Schema({

    "date":{
        type:Date,
        default:Date.now()
    },
    
    "from":{
        type:String,
        default:"Admin"
    },
    "title":String,

    "message":String,

    "staffs":{
        type:Object,
        default:{}
    },

    "classes":Array,

    "permanent_delete": {
        type:Boolean,
        default:false
    },
    "delete": {
        type:Boolean,
        default:false
    },
})

const circular = mongoose.model('circular', circular_model);

module.exports = circular;