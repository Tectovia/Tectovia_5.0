const mongoose=require('mongoose');
const bonafide_schema = new mongoose.Schema({
    id:{
        type:String
    },
    name:{
        type:String
    },
    class:{
        type:String
    },
    section:{
        type:String
    },
    bonafide_title:{
        type:String,

    },
    bonafide_des:{
        type:String,
        

    },
 approval:{
    type:Boolean
    
 }
})
const bonafide= mongoose.model("bonafide",bonafide_schema);


module.exports = bonafide;