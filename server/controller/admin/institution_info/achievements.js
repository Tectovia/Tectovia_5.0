require('../../../database/database');
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');

// Models Here!
const achievements = require('../../../models/admin/achievements_model');

// Body-Parser
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

exports.achievements = async (req, res) => {   
    achievements.find( function(err, docs) {
        if (err) {
            console.log(err);
        } else {
            console.log("Found the following documents:");
            console.log(docs);
            res.render("admin/institution_info/achievements", { docs,  add: 'none', edit: 'none', page_title: 'Achievements'});
        }
    });  
};

exports.form_achievements = async (req, res) => {
    achievements.find( function(err, docs) {
        if (err) {
            console.log(err);
        } else {
            console.log("Found the following documents:");
            console.log(docs);
            res.render("admin/institution_info/achievements", { docs,  add: 'display', edit: 'none', page_title: 'Achievements'});
        }
    });
};

exports.submit_achievements = async (req, res) => {
   const data=req.body;
   
};