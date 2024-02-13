const mongoose = require('mongoose');

const achievement_schema = new mongoose.Schema({
 
    title: {
        type: String
    },

    field: {
        type: String
    },
    date:{
        type:String
    },
    img:{
        type:String
    },
    desc:{
        type:String
    }
});

const achievements = mongoose.model('achievements', achievement_schema);

module.exports = achievements;