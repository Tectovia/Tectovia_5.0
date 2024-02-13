require('../../../database/database');
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');

// Models Here!
const student_model = require('../../../models/admin/student_model');
const class_model = require('../../../models/admin/section_model');

// Body-Parser
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));


//------------------- VIEW PARENT -------------------


