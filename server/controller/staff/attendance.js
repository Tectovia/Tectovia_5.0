
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

var myObjectStr=process.env.SECTION
const section_map = JSON.parse(myObjectStr);

exports.attendance = async (req, res) => {
  var id = req.params.id;
 
  const date = new Date();
  const year = date.getFullYear();
  // Check for date  & Assign
  if (req.params.date == "today") {
    var datetext = format(date, "dd-MM-yyyy");
  } else {
    var datetext = req.params.date;
  }
// Get date from Academic calender for Dayorder

  const acad_data = await db.collection("academic_calendar").findOne({ year: year });
  const dayorder = acad_data[datetext].dayorder;

  var staff = await staff_model.find( { _id: id }, { staff_id: 1, staff_name: 1, time_table: 1 } );
  
  if (dayorder != "null") {
    
    const order = {date: datetext,dayorder: dayorder,};
    var staff_ack = ["null", "null", "null", "null", "null"];
    var absent = [0, 0, 0, 0, 0];
    var strength = [0, 0, 0, 0, 0];

    // console.log(staff);
    var periods = staff[0].time_table[`day${dayorder}`];
    // Getting Specific day timetable
    for (let i = 0; i < periods.length; i++) {
      const item = periods[i];

      if (item["class"] != "null") {
        var section=item['sec'];
        section=section_map[section];
        coll_name=  item['class'].split('_')[0]+"_attendance";
       const attend_model=mongoose.model(coll_name);

        var data = await attend_model.findOne({ [datetext]: { $exists: true } });
        let strn_count = 0;
        let count = 0;
       

        for (const key in data[datetext][section]) {
          if (key != "ack") {
            if (data[datetext][section].hasOwnProperty(key)) {
              strn_count++;
               
              if (data[datetext][section][key][i] == 0) {
                
                count++;
              }
            }
          }
        }

        staff_ack[i] = data[datetext][section]["ack"][i];
        console.log(count);
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
  const name =req_data.std.split('_')[0]+'_attendance'
  const attend_model=mongoose.model(name)
  var section=req_data.sec;
  section=section_map[section]
  const data=  await attend_model.findOne({ [req_data.date]: { $exists: true } });
  const stu_data=data[req_data.date][section];
  console.log(stu_data);
  const staffdata=await staff_model.find({ _id: req_data.id }, { staff_id: 1, staff_name: 1 })
  
   res.render("staff/attendance_list", {staffdata, stu_data,req_data, });
};

exports.attendance_submit = async (req, res) => {
  var req_data = req.params;
  const hour = parseInt(req_data.hour);
  const rec_data = req.body;
  var section=req_data.sec;
  section=section_map[section]
  const name =req_data.std.split('_')[0]+'_attendance';
  const attend_model=mongoose.model(name);
  var data = await  attend_model.findOne({ [`${req_data.date}`]: { $exists: true } });
  
  for (let key in rec_data) {
   
    if (key != "staff_id") {
      
      data[req_data.date][section][key][hour] = await parseInt(rec_data[key]);
    }
  }

  data[req_data.date][section]["ack"][hour] = rec_data.staff_id;
  
 var result=await attend_model.replaceOne({ [`${req_data.date}`]: { $exists: true } }, data)
 console.log(result);
      res.redirect(`/staff/attendance/${req_data.id}/${req_data.date}`);

};

async function Timetable_gen() {
  const date = new Date();
  const year=date.getFullYear();
  const datetext = format(date, "dd-MM-yyyy");
  // Fetch data from Calendar
  const acad_data = await db.collection("academic_calendar").findOne({ year: year });
  const dayorder=acad_data[datetext].dayorder
// Create & insert data if  Working day
   if (dayorder !='null') 
   {  
      // Fetch data from Class list
      var classes=await class_model.find({},{id:1,section_name:1}).sort('id')
      var   attendance={}
      attendance[datetext]=[]
      var class_name='null';
      // accesssing Each class
      for(var j=0;j<classes.length;j++)
      {
            // insert data when loop reaches last Section
            if (class_name!='null'&&class_name!=classes[j]['id']) 
            {
                  var model_name=class_name.split('_')[0]+"_attendance";
                  var attend_model=mongoose.model(model_name);
                  attend_model.create(attendance, function(err, result) 
                  {
                        if (err) {
                            console.error('Error inserting attendance data:', err);
                        } else {
                            console.log('Attendance data of :',class_name,'is :', result);
                        }
                  });
                  attendance[datetext]=[]
            }
            class_name=classes[j]['id'];
            // Get student id from Batch Collection
            var batch_model=mongoose.model(classes[j]['id']);
            var section=await batch_model.find({section:classes[j].section_name},{_id:0,rollno:1});
            var keys = {};
            // create attendance for Each student
            for (var i = 0; i < section.length; i++) 
            {
                keys[section[i].rollno] = [1, 1, 1, 1, 1];
            }
            var ack =  ['null', 'null', 'null', 'null', 'null'];
            keys['ack'] = ack;
            attendance[datetext].push(keys);
                
      }
      // Insert the last class data  
      var model_name=class_name.split('_')[0]+"_attendance";
      var attend_model=mongoose.model(model_name);
      attend_model.create(attendance, function(err, result)
      {
            if (err) {
                console.error('Error inserting attendance data:', err);
            } else {
              console.log('Attendance data of :',class_name,'is :', result);
            }
      });
            
   }
  //  Else part --If current date is holiday
   else{
    console.log("Today is holiday");
   }
}

const job = schedule.scheduleJob("0 10 * * *", function (fireDate) {
  console.log("This job was supposed to run at " + fireDate);
  Timetable_gen();
});

// Timetable_gen();




// async function  demo() {
//   const staffId = "89"; // Replace with the actual staff ID

//   const data= await staff_model.aggregate([
//     {
//       $match: { "staff_id": staffId }
//     },
//     {
//       $project: {
//         timetable: {
//           $concatArrays: [
//             "$time_table.day1", "$time_table.day2", "$time_table.day3", "$time_table.day4", "$time_table.day5", "$time_table.day6"
//           ]
//         }
//       }
//     },
//     {
//       $unwind: "$timetable"
//     },
//     {
//       $match: {
//         "timetable.sub": { $ne: "null" }
//       }
//     },
//     {
//       $group: {
//         _id: {
//           class: "$timetable.class",
//           subject: "$timetable.sub",
          
//         }
//       }
//     },
//     {
//       $project: {
//         _id: 0,
//         class: "$_id.class",
//         subject: "$_id.subject",
        
//       }
//     }
//   ]);
  

// console.log(data);
// }



