const mongoose = require('mongoose');

const fees_schema=new mongoose.Schema({
    class:{
        type:String,
    },
        I_mid_term:[{
            fees_title:{
                    type:String
            },
            fees_amount:{
                    type:Number
            }
        }],
        II_mid_term:[{
            fees_title:{
                type:String
            },
            fees_amount:{
                type:Number
            }
        }],
        III_mid_term:[{
            fees_title:{
                type:String
            },
            fees_amount:{
                type:Number
            }
        }],
        total:{
            type:Number
        }
    }
)

const class_fees = mongoose.model("class_fees", fees_schema);

module.exports = class_fees;