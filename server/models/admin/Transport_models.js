const mongoose = require('mongoose');

const transports_schema = new mongoose.Schema({
        bus_number:{

            type : Number 

            },

        number_plate:{

            type:String

            },

        route:{

            type:String
            
            },

        Driver:{

            type:String
                
           },

        Alterdriver:{

            type:String

          },

     
        roll_no1:{

            type: Number

        }, 

        roll_no2:{

            type: Number
            
        }    

})

const bus_data=mongoose.model("transport",transports_schema);

exports.bus_data=bus_data;