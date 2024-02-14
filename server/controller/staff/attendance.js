
require("../../database/database");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const express = require("express");
const schedule = require("node-schedule");
const { format, eachDayOfInterval } = require("date-fns");

const staff_model = require("../../models/admin/staff_information_model");
const class_model = require("../../models/admin/section_model");
const subject_model = require("../../models/admin/subject_model");


var db = mongoose.connection;
// Body-Parser
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));


exports.attendance = async (req, res) => {
  var id = req.params.id;
 
  const date = new Date();
  const year = date.getFullYear();
  if (req.params.date == "today") {
    var datetext = format(date, "dd-MM-yyyy");
  } else {
    var datetext = req.params.date;
  }

  const acad_data = await db
    .collection("academic_calendar")
    .findOne({ year: year });

  const dayorder = acad_data[datetext].dayorder;
  var staff = await staff_model.find(
    { _id: id },
    { staff_id: 1, staff_name: 1, time_table: 1 }
  );
  console.log(staff);
  if (dayorder != "null") {
    const order = {
      date: datetext,
      dayorder: dayorder,
    };
    var staff_ack = ["null", "null", "null", "null", "null"];
    var absent = [0, 0, 0, 0, 0];
    var strength = [0, 0, 0, 0, 0];

    // console.log(staff);
    var periods = staff[0].time_table[`day${dayorder}`];
    for (let i = 0; i < periods.length; i++) {
      const item = periods[i];

      if (item["class"] != "null") {
        coll_name =
          "attend_" +
          item["class"].toLowerCase().replace(" ", "_") +
          "_" +
          item["sec"];

        var data = await db
          .collection(coll_name)
          .findOne({ [datetext]: { $exists: true } });
        let strn_count = 0;
        let count = 0;
        for (const key in data[datetext]) {
          if (key != "ack") {
            if (data[datetext].hasOwnProperty(key)) {
              strn_count++;

              if (data[datetext][key][i] == 0) {
                console.log(key, "absent");
                count++;
              }
            }
          }
        }

        staff_ack[i] = data[datetext]["ack"][i];
        absent[i] = count;
        strength[i] = strn_count;
        console.log("strenth", strength);
        console.log("absent", absent);
      }
    }
    const details = {
      strength: strength,
      absent: absent,
    };
    console.log(staff_ack);
    res.render("staff/attendance", {
      staffdata: staff,
      periods,
      details,
      order,
      staff_ack,
    });
  } else {
    const order = {
      date: datetext,
      dayorder: dayorder,
    };
    res.render("staff/attendance", {
      staffdata: staff,
      order,
    });
  }
};
exports.attendance_link = async (req, res) => {
  const req_data = req.params;
  const name =req_data.std.toLowerCase().replace(" ", "_") + "_" +req_data.sec;

  const data=  await db.collection(`attend_${name}`).findOne({ [req_data.date]: { $exists: true } });
  const stu_data=data[req_data.date];
  console.log(stu_data);
  const staffdata=await staff_model.find({ _id: req_data.id }, { staff_id: 1, staff_name: 1 })
  

     
   res.render("staff/attendance_list", {staffdata, stu_data,req_data, });
       
   
};
exports.attendance_submit = async (req, res) => {
  var req_data = req.params;
  const hour = parseInt(req_data.hour);
  const rec_data = req.body;
  const name =
    req_data.std.toLowerCase().replace(" ", "_") + "_" + req_data.sec;
  var data = await db
    .collection(`attend_${name}`)
    .findOne({ [`${req_data.date}`]: { $exists: true } });

  for (let key in rec_data) {
    if (key != "staff_id") {
      data[req_data.date][key][hour] = await parseInt(rec_data[key]);
    }
  }

  data[req_data.date]["ack"][hour] = rec_data.staff_id;

  db.collection(`attend_${name}`)
    .replaceOne({ [`${req_data.date}`]: { $exists: true } }, data)
    .then((ack) => {
      console.log("update", ack);
      res.redirect(`/staff/attendance/${req_data.id}/${req_data.date}`);
    });

  // res.send(req.body);
};

async function Timetable_gen() {
  const date = new Date();
  const year=date.getFullYear();
  const datetext = format(date, "dd-MM-yyyy");
  const acad_data = await db.collection("academic_calendar").findOne({ year: year });
   const dayorder=acad_data[datetext].dayorder
   if (dayorder !='null') {
  class_model.find({}, { id: 1, section_name: 1 }).then((class_data) => {
    class_data.forEach((item) => {
      // create collection
      const name = item.id+"_" + item.section_name;

      //  fetch data of each class
      const selected = mongoose.model(item.id);
      selected
        .find({ section: item.section_name }, { rollno: 1 })
        .then((stu_data) => {
          attendance = {};
         
          attendance[datetext] = {};

         
          stu_data.forEach((item) => {
            attendance[datetext][item.rollno] = [1, 1, 1, 1, 1];
          });
          attendance[datetext]["ack"] = [
            "null",
            "null",
            "null",
            "null",
            "null",
          ];
          db.collection(`attend_${name}`)
            .insertOne(attendance)
            .then((x) => {
              console.log(x);
            });
        });
    });
  });

   }
   else{
    console.log("today is holiday");
   }
}
// dog();
const job = schedule.scheduleJob("0 10 * * *", function (fireDate) {
  console.log("This job was supposed to run at " + fireDate);
  Timetable_gen();
});

// Timetable_gen();


/*
assisnment

{
obj_id()
title:python oops
sub:python
class:first standard
desc:
sec:A
due:2/12/2023
students:[
 101:{
    ack:0
    attachment: null
    mark:0
  },
 102:
 {
    ack:1
    attachment:102_assignment.pdf
    mark:7
  }
]
}



{
title:java oops
sub:java
class:first standard
sec:A
due:2/12/2023
student:[
 101:{
    ack:0
    attachment: null
    mark:0
  },
 102:
 {
    ack:1
    attachment:102_assignment.pdf
    mark:7
  }
]
}
*/


async function  demo() {
  const staffId = "89"; // Replace with the actual staff ID

  const data= await staff_model.aggregate([
    {
      $match: { "staff_id": staffId }
    },
    {
      $project: {
        timetable: {
          $concatArrays: [
            "$time_table.day1", "$time_table.day2", "$time_table.day3", "$time_table.day4", "$time_table.day5", "$time_table.day6"
          ]
        }
      }
    },
    {
      $unwind: "$timetable"
    },
    {
      $match: {
        "timetable.sub": { $ne: "null" }
      }
    },
    {
      $group: {
        _id: {
          class: "$timetable.class",
          subject: "$timetable.sub",
          
        }
      }
    },
    {
      $project: {
        _id: 0,
        class: "$_id.class",
        subject: "$_id.subject",
        
      }
    }
  ]);
  

console.log(data);
}

