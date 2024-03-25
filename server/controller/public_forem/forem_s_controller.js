require('../../database/database')
const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const mongoose = require('mongoose')
app.use(bodyParser.urlencoded({ extended: false }));

const science_model = require('../../models/forem_model/science_model');
const { classes_map } = require('../universal_controller/class_map');
const StaffId = require('../../models/admin/staff_information_model');



// Science Page
exports.SciencePage = async (req, res) => {
    console.log('hello Science Page');
    try {
        const documents = await science_model.find();
    
        // Sort the answers within each document, placing verified answers first
        documents.forEach(doc => {
            doc.answer.sort((a, b) => {
                if (a.verified && !b.verified) return -1; // Place verified answers first
                if (!a.verified && b.verified) return 1; // Place unverified answers last
                return 0; // Maintain the order for answers with the same verified status
            });
        
        });
        res.render('public_forem/forem_science',{vim:documents,user:req.session.user_id,role: req.session.role})
    
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error fetching documents');
    }
    
}


//Searching New Questions

exports.QuestScience = async (req, res) => {
    console.log('Arts search: ', req.body.question);
    var qq = req.body.question;
    await science_model.find({ $text: { $search: qq } }).then(data => {
         console.log('stream',data);
        res.render('public_forem/forem_science', { vim: data,user:req.session.user_id,role: req.session.role })
    })
}



// Science New Question Posting

exports.new_science_question = async (req, res) => {
    const newQuestion = req.body.Nquestion;
    const new_question = newQuestion.trimEnd();
    try {
        // Save the new question to the database or perform other actions
        var postedby = '';
        var role = req.session.role;
        if (role !== "staff" && role !== 'admin') {
            var blah = role.split('_');
            
            // var class_name = year + "_" + batch;
            var class_name = blah[0]+ "_" + blah[1];
            console.log('dvfnhvf',class_name);
            var student_model = mongoose.model(class_name);
            var student = await student_model.findOne({ 'rollno': req.session.user_id }, { name: 1,section:1, _id: 0 })
          
            postedby = student.name;
            var section = classes_map[blah[0]];
            console.log(section);
            role = req.session.user_id+" "+'('+section+')';
           
        }
        else if(role == 'admin'){
            postedby = req.session.user_id.toUpperCase();
        }
        else {
            var findStaff = await StaffId.findOne({ 'staff_id': req.session.user_id }, { staff_name: 1 });
            console.log(findStaff.staff_name);
            postedby = findStaff.staff_name;
        }
        const newQuestionObj = new science_model({ question: new_question, stream: 'science', postedBY: {username:postedby,role:role}});
        newQuestionObj.save()
            .then(() => {
                console.log('New question posted successfully!');
                res.redirect('/forem/science')
            })
            .catch((err) => {
                console.error('Error posting new question:', err);
                res.status(500).send('Error posting new question'); // Send an error response to the client
            });
    }
    catch (e)
    {
        res.status(500).send('Error posting '); 
    }
}


// Posting_Answers
exports.forum_science_answer = async (req, res) => {
    console.log(req.body);
   
    var postedby = '';
    var role = req.session.role;
    if (role !== "staff" && role !== 'admin') {
        var blah = role.split('_');
        
        // var class_name = year + "_" + batch;
        var class_name = blah[0]+ "_" + blah[1];
        console.log('dvfnhvf',class_name);
        var student_model = mongoose.model(class_name);
        var student = await student_model.findOne({ 'rollno': req.session.user_id }, { name: 1,section:1, _id: 0 })
      
        postedby = student.name;
        var section = classes_map[blah[0]];
        console.log(section);
        role = req.session.user_id+" "+'('+section+')';
       
    }
    else if(role == 'admin'){
        postedby = req.session.user_id.toUpperCase();
    }
    else {
        var findStaff = await StaffId.findOne({ 'staff_id': req.session.user_id }, { staff_name: 1 });
        console.log(findStaff.staff_name);
        postedby = findStaff.staff_name;
    }
    try
    {
        const objectid = req.body.obji;
        const answer = req.body.answerr;
        const answers = answer.trimEnd();




        const updatedQuestion = await science_model.findByIdAndUpdate(objectid, { $push: { answer: { Answeredby: postedby,role:role,answer: answers,verified: false} } }, { new: true });
        console.log('Updated document:', updatedQuestion);
        res.redirect('/forem/science');
    }
    catch (error) {
        console.log(error);
    }


}



// filter Option
exports.filterScienceQuestion = async (req, res) => {
    console.log(req.body);
    const ke = req.body.AnsNO;
    try {
        let documents;
        if (ke === 'Yes') {
            documents = await science_model.find({ answer: { $exists: true, $ne: [] } });
            documents.forEach(doc => {
                doc.answer.sort((a, b) => {
                    if (a.verified && !b.verified) return -1; // Place verified answers first
                    if (!a.verified && b.verified) return 1; // Place unverified answers last
                    return 0; // Maintain the order for answers with the same verified status
                });
            });
        } else {
            documents = await science_model.find({ answer: { $size: 0 } });
        }
        res.render('public_forem/forem_science', { vim: documents,user:req.session.user_id,role: req.session.role });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error fetching documents');
    }

}




// verification By admin



exports.forem_verification_science= async (req, res) => {
    console.log(req.params.data);
    console.log(req.params.question);
    let quest = req.params.question;
    let question = quest.trimEnd();
    console.log(question);
    let id = req.params.data;
    var ids = id.trimEnd()
   


    try {
        const result = await science_model.updateOne(
            { 'answer.answer': ids, question: question }, // Query
            { $set: { 'answer.$.verified': true } } // Update
        );
        console.log(result);
        console.log('deucuhb');
        res.json({ success: true }); // Send the update result as a JSON response
    } catch (error) {
        console.error('Error updating document:', error);
        res.status(500).json({ error: 'Error updating document' });
    }
}

//Deleting  User Questions
exports.del_question_Science = async (req, res) => {
    console.log(req.params.id);
    const question = await science_model.findByIdAndDelete({ _id: req.params.id })
    console.log(question);
    res.redirect('/forem/UserQuestion')
    }