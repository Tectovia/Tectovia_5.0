const mongoose = require("mongoose");

const class_list_schema = new mongoose.Schema({
  id: {
    type: String,
  },

  section_name: {
    type: String,
  },

  section_incharge_id: {
    type: String,
  },

  section_incharge_name: {
    type: String,
  },

  room_number: {
    type: String,
  },
  time_table: {
    day1: [
      {
        sub: String,
        staff_name:String,
        staff_id:String
      }
    ],
    day2: [
      {
        sub: String,
        staff_name:String,
        staff_id:String
      }
    ],
    day3: [
      {
        sub: String,
        staff_name:String,
        staff_id:String
      }
    ],
    day4: [
      {
        sub: String,
        staff_name:String,
        staff_id:String
      }
    ],
    day5: [
      {
        sub: String,
        staff_name:String,
        staff_id:String
      }
    ],
    day6: [
      {
        sub: String,
        staff_name:String,
        staff_id:String
      }
    ],
  },
});

const class_list = mongoose.model("class_list", class_list_schema);

module.exports = class_list;

