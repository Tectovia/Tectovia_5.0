require("../../../database/database");
const bodyParser = require("body-parser");``
const express = require("express");
const mongoose = require("mongoose");

// Models Here!
const class_model = require("../../../models/admin/section_model");
const subject_model = require("../../../models/admin/subject_model");
const student_model = require("../../../models/admin/student_model");
const staff_model = require("../../../models/admin/staff_information_model");
var db = mongoose.connection;
const Forum=require("../../../models/admin/forum_model");
// Body-Parser
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

exports.forum = async (req, res) => {
    let edit=true;
    try {
        // Fetch latest forum data from the database
        const forum=null
        const class_info = await class_model.find();
        const forums = await Forum.find({ show: true });
        const staff_data = await staff_model.find({
            $or: [{ forum_incharge: { $exists: false } }, { forum_incharge: null }]
        });
       
        
        // Render the forum page with the latest data
        res.render("./admin/forum/forum", { class_info: class_info, staff: staff_data, forums: forums ,forum: forum,edit});
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).send("An error occurred. Please try again later.");
    }
};

exports.forum_post = async (req, res) => {
    try {
        // Extract data from the request body
        const forum_title = req.body.forum_title;
        const forum_incharge_ids = req.body.forum_incharge;
        const forum_class = req.body.forum_class;
        const class_info = await class_model.find();
        const staff_data = await staff_model.find();
        const forums = await Forum.find();
        
        const forum_incharge = await staff_model.find({ staff_id: { $in: forum_incharge_ids } });

        const newForumPost = new Forum({
            forum_title: forum_title,
            forum_incharge: forum_incharge,
            forum_class: forum_class,
            show: true, 
            total: 0
        });
        await newForumPost.save();

        for (const incharge of forum_incharge) {
            await staff_model.findOneAndUpdate(
                { staff_id: incharge.staff_id },
                { forum_incharge: forum_title }
            );
        }
        
        res.redirect("/admin/forum")
    } catch (err) {
        console.error("An error occurred:", err);
        res.status(500).send("Error occurred while processing your request.");
    }
};
 exports.delete_forum = async (req, res) => {
    const forum_id = req.params.id; 
  
    try {
        if (!mongoose.Types.ObjectId.isValid(forum_id)) {
            return res.status(400).json({ message: "Invalid ObjectId" });
        }
        
        const forum = await Forum.findById(forum_id).exec();
        if (!forum) {
            return res.status(404).json({ error: "Forum not found" });
        }
        
        // Soft delete the forum by setting show to false
        const updatedForum = await Forum.findByIdAndUpdate(forum_id, { show: false }, { new: true }).exec();
        if (!updatedForum) {
            console.log("Cannot delete forum");
            return res.status(500).json({ error: "Internal server error" });
        }
        for (const incharge of forum.forum_incharge) {
            if (incharge && incharge.staff_id) { // Add this null check
                const updatedStaff = await staff_model.findOneAndReplace(
                    { staff_id: incharge.staff_id },
                    { forum_incharge: null },
                    { new: true }
                ).exec();
                if (!updatedStaff) {
                    console.log(`Failed to update staff ${incharge.staff_id}`);
                }
            }
        }
                res.redirect("/admin/forum");
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
};


exports.edit_forum_form = async (req, res) => {
    let edit=true;
    try {
        const forum_id = req.params.id;
        const forums = await Forum.find({show:true})
       const forum=await Forum.findById(forum_id);
        if (!Forum) {
            return res.status(500).json({ error: "Failed to update forum" });
        }
        const class_info = await class_model.find();
        const staff_data = await staff_model.find();

       res.render("./admin/forum/forum", { forum:forum, class_info, staff: staff_data,forums,edit});
    } catch (error) {
        console.error("Error updating forum:", error);
        res.status(500).send("An error occurred while updating the forum.");
    }
};

exports.submitForm = async (req, res) => {
    try {
        const forumId = req.params.id;
        const { forum_title, forum_incharge, forum_class } = req.body;
        const formattedIncharge = Array.isArray(forum_incharge) ? forum_incharge.map(id => ({ staff_id: id })) : [{ staff_id: forum_incharge }];
        const updatedForum = await Forum.findByIdAndUpdate(forumId, {
            forum_title,
            forum_incharge: formattedIncharge,
            forum_class: Array.isArray(forum_class) ? forum_class : [forum_class]
        }, { new: true });
        
        res.redirect("/admin/forum");
    } catch (error) {
        console.error("Error updating forum:", error);
        res.status(500).send("An error occurred while updating the forum.");
    }
};