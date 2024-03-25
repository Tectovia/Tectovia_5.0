const express = require('express');
var router = express.Router();
var forem = require('../controller/public_forem/forem_controller')
var a_forem = require('../controller/public_forem/forem_a_controller')
var s_forem = require('../controller/public_forem/forem_s_controller')


// This Page is for Open Forum 



//Forem index Page
router.get('/student/forem/index/:_id/:batch', forem.mainPageStudent)
router.get('/staff/forem/index/:_id', forem.mainPageStaff)
router.get('/admin/forem/index',forem.mainPageAdmin)
//------------*-----------

// Forem back pages 
router.get('/student/forem/index/redirect/:rollno/:batch', forem.redirecting)
router.get('/staff/forem/index/redirection/:_id',forem.redirectingStaff)

//Forem selection Pages
router.get('/forem/arts', a_forem.ArtsPage);
router.get('/forem/science',s_forem.SciencePage);
router.get('/forem/UserQuestion', forem.UserQuestion);
// ----------*----------

// Adding New Questions

router.post('/forem/new_arts_question', a_forem.new_arts_question);

router.post('/forem/new_science_question', s_forem.new_science_question);


// Posting Answers

router.post('/forem/arts_answers', a_forem.forum_arts_answer)
router.post('/forem/science_answers', s_forem.forum_science_answer)
 

// Filter_Arts
router.post('/public_forem/filter_Arts_question', a_forem.filterArtsQuestion);

// Filter_Science
router.post('/public_forem/filter_Science_question',s_forem.filterScienceQuestion);


// Verify by admin Arts
router.post('/forem_verification_arts/:data/:question', a_forem.forem_verification_arts);

// Verify by admin Science

router.post('/forem_verification_science/:data/:question', s_forem.forem_verification_science);

// Searching Questions

router.post('/QuestA', a_forem.QuestArts);
router.post('/QuestS',s_forem.QuestScience);

// Forem Deleting Questions
router.get('/forem/deleteArts/:id', a_forem.del_question_Arts);

router.get('/forem/deleteScience/:id', s_forem.del_question_Science);

module.exports = router;