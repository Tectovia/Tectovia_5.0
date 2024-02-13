const mongoose=require('mongoose')

const circular_model= new mongoose.Schema({
    "date":String,
    
    "from":{
        type:String,
        default:"Admin"
    },
    "title":String,

    "message":String,

    "staffs":{},

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