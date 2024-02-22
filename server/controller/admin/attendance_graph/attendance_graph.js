const mongoose = require('mongoose');
const {format, getDate, getMonth, getYear, getTime ,parseISO,isValid} = require('date-fns');
const {classes_map} =require("../../universal_controller/class_map")
require('dotenv').config();

var myObjectStr=process.env.SECTION
const section_map = JSON.parse(myObjectStr);


function isValidDate(dateString) {
  const parsedDate = parseISO(dateString);
  console.log(parsedDate);
  return isValid(dateString);
}
exports.attendance_graph = async (req, res) => {
  var datetext;
  
  var req_date=req.params.date;
  const date=Date.now();
  if (req.params.date== "today") {
     datetext = format(date, "dd-MM-yyyy");
  } else
    {
       datetext =req_date;
    }
  const models=mongoose.modelNames();
  var attend_models=models.filter(model=>model.includes('_attendance'));
  var data=[['Class','Total','Present','Absent']];
  for(let i=0;i<attend_models.length;i++)
  {
    const attend_model=mongoose.model(attend_models[i]);
    var class_attend= await attend_model.findOne({[datetext]:{$exists:true}});
    if(class_attend!=null)
    {
      for(let j=0;j<class_attend[datetext].length;j++){
        var present=0,absent=0,total=0;

        for( key in class_attend[datetext][j])
        { 
          if(key!='ack')
          {
                if (class_attend[datetext][j][key][0]&&class_attend[datetext][j][key][3]) 
                present++;
                else
                absent++;
            total=absent+present;
          }
        }
        var sec=Object.keys(section_map).find(key => section_map[key] === j);
        var arr=[`${i+1}-${sec}`,total,present,absent];
        data.push(arr);
      }
    }
  }
    if (data.length<2) {
      data.push(['null',0,0,0])
      
    }
    res.render("admin/attendance_graph",{'data':data});
  };
  