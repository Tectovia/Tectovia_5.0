const { default: mongoose } = require('mongoose');

require('mongoose');

const login_schema= new mongoose.Schema({

    user_id:{
        type:String,
        required:true
    },
    name: {
        type: String,
    },
    
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        required:true
    }
})


const login_data = mongoose.model('login_data', login_schema);

// var data=new login_data({
//     user_id:'admin',
//     password:'123',
//     role:'admin'
    
// })
// function dog() {
//     data.save().then((datas)=>{
//         console.log(datas);
//     })
    
// }
// dog();


// var data=new login_data({
//     user_name:'staff',
//     password:'123',
//     role:'staff'
    
// })
// data.save((e,dat)=>{
//     console.log(dat);
// })



// var data=new login_data({
//     user_name:'parent',
//     password:'123',
//     role:'parent'
    
// })
// data.save((e,dat)=>{
//     console.log(dat);
// })


// var data=new login_data({
//     user_name:'student',
//     password:'123',
//     role:'student'
    
// })
// data.save((e,dat)=>{
//     console.log(dat);
// })

module.exports = login_data;