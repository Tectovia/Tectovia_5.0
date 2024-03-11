const mongoose=require('mongoose')

const forum_schema=new mongoose.Schema({
    forum_title:{
        type:String,
    },
    forum_incharge:[
        {
            staff_name: String,
            staff_id: String,
        }
    ],
    forum_class:[
        {
            type:String,
        }
    ],
    show:{
        type: Boolean,
        default: true,
    },
    total:{
        type:Number,
    }
})
const forum = mongoose.model("forum",forum_schema);

module.exports = forum;