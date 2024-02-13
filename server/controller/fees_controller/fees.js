require('../../database/database');
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require("bcrypt");

// Models Here!

const class_model = require('../../models/admin/section_model');
const login_data = require('../../models/login_data/login_info_model');
const staff_model = require("../../models/admin/staff_information_model");
const { date } = require('date-fns/locale');
const class_fees = require('../../models/admin/fees_models');
const {classes_map}=require('../../controller/universal_controller/class_map')

// Body-Parser
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

 const dayhour=JSON.parse(process.env.DAYHOUR);

 //Fees function
 exports.fees=async(req,res)=>{
    try {
        console.log('Form submitted:', req.body);

        const title = req.params.title;
        var name = title.split('_')[0];
        name = classes_map[name];

        const term = req.body.fees_term;
        const f_title = req.body.fees_title;
        const amount = req.body.fees_amount;
        var data = {
            'class': name,
            I_mid_term: [],
            II_mid_term: [],
            III_mid_term: [],
            total: 0
        };
        if (Array.isArray(term)) {
            for (var i = 0; i < f_title.length; i++) {
                var objdata = {
                    'fees_title': f_title[i],
                    'fees_amount': parseInt(amount[i])
                };

                data['total'] += parseInt(amount[i]);

                data[term[i]].push(objdata);
            }
        } else {
            var obj = {
                'fees_title': f_title,
                'fees_amount': parseInt(amount)
            }
            data['total'] += parseInt(amount);
            data[term].push(obj);
        }

        const new_fees = new class_fees(data);

        const fees = await new_fees.save();
        console.log("Fees data saved:", fees);
        res.redirect('/admin/class_info/class_list/' + title);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
   
 }

 //Update Fees function
 exports.updatefees = async (req, res) => {
    try {
        console.log('Form submitted:', req.body);

        const title = req.params.title;
        var name = title.split('_')[0];
        name = classes_map[name];

        const term = req.body.fees_term;
        const f_title = req.body.fees_title;
        const amount = req.body.fees_amount;
        var data = {
            'class': name,
            I_mid_term: [],
            II_mid_term: [],
            III_mid_term: [],
            total: 0
        };

        //update data
        if (Array.isArray(term)) {
            for (var i = 0; i < f_title.length; i++) {
                var objdata = {
                    'fees_title': f_title[i],
                    'fees_amount': parseInt(amount[i])
                };

                data['total'] += parseInt(amount[i]);

                data[term[i]].push(objdata);
            }
        } else {
            var obj = {
                'fees_title': f_title,
                'fees_amount': parseInt(amount)
            }
            data['total'] += parseInt(amount);
            data[term].push(obj);
        }

        const filter = { class: name };
        const update = data;
       

        const fees = await class_fees.findOneAndReplace(filter, update);

        console.log("Fees data updated:", fees);
        res.redirect('/admin/class_info/class_list/' + title);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
}

//  exports.updatefees=async(req,res)=>{
//     try {
//         console.log('Fees update called');
//         res.send('update page')
//     }catch (err){
//         console.log('err');
//     }
// }