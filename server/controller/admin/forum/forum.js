require("../../../database/database");
const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");

// Models Here!
const class_model = require("../../../models/admin/section_model");
const subject_model = require("../../../models/admin/subject_model");
const student_model = require("../../../models/admin/student_model");
const staff_model = require("../../../models/admin/staff_information_model");
var db = mongoose.connection;
// Body-Parser
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

// exports.forum = async(req,res)=>{
//       res.render("./admin/forum/forum",{ staff:staff });
//   }

exports.forum = async (req, res) => {
    try {
        const class_info = await class_model.find();
        const staff_data = await staff_model.find();

       // res.send("sucess")
        // Pass both class_info and staff_data as properties of a single object
         res.render("./admin/forum/forum", { class_info: class_info, staff: staff_data });
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).send("An error occurred. Please try again later.");
    }
};