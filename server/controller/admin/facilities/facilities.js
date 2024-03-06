const mongoose = require('mongoose');
const {bus_data} =require('../../../models/admin/Transport_models')
const staff_model= require('../../../models/admin/staff_information_model')

exports.hostel=async (req,res)=>{
    res.render("admin/facilities/hostel");
}

exports.transport=async (req,res)=>{
    res.render("admin/facilities/transport");
}
// ----------addtransport-----------
exports.addtransport=async (req,res)=>{
    try {
        console.log('dfghjgbh',req.body);
        var transportGG=bus_data
        const newDocumentData = new transportGG ({
            bus_number: req.body.bus_number,
            number_plate: req.body.number_plate,
            route:req.body.route,
            roll_no1: req.body.roll_no1,
            roll_no2:req.body.roll_no2,
            Driver:req.body.Driver,
            Alterdriver:req.body.Alterdriver
            // staff_id:req.body.staff_id
        
        });
        console.log('dyufhreuvj',newDocumentData);
        
        //const newdoc = new  transportmodel(newDocumentData);
        const result = await newDocumentData.save();
        console.log(result);
        res.redirect("/admin/facilities/transport");

}catch (error) {
    console.error(error);
    red.render("error")
}
};

exports.transport=async (req,res)=>{
    try {
        let transport = {};
        
        // Retrieve the data from the database
        const transport_datails = await bus_data.find();
        const nonteach = await staff_model.find({staff_designation:'non-teaching'})
        console.log('staff',nonteach);
       
       
        
        // Assuming you want to display both girls and boys students
        transport = {
            transports: transport_datails,
            
        };

        console.log(transport);
        

        // Pass the data to the rendering context and render the page
        res.render('admin/facilities/transport', {transport,nonteach });
       // res.send("sucess")
     } catch (error) {
        console.error(error);
        res.render('error'); 
    }
  
}
// exports.transport=async (req,res)=>{
//     try {
//         let transport = {};
        
//         // Retrieve the data from the database
//         const transport_datails = await staff_model.find();
//         //const nonteach = await;
//         // Assuming you want to display both girls and boys students
//         transport = {
//             transports: transport_datails,
            
//         };

//         console.log(transport);

//         // Pass the data to the rendering context and render the page
//         res.render('admin/facilities/transport', {transport});
//        // res.send("sucess")
//     } catch (error) {
//         console.error(error);
//         res.render('error');
//     }
  
// }



exports.lab=async (req,res)=>{
    res.render("admin/facilities/lab");
}

exports.library=async (req,res)=>{
    res.render("admin/facilities/library");
}

exports.coaching=async (req,res)=>{
    res.render("admin/facilities/coaching");
}