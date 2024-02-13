const { default: mongoose } = require("mongoose")

const date = new Date()

const batch_map=()=>{


  const classes=[ 
                  "First Standard",
                  "Second Standard", 
                  "Third Standard",
                  "Fourth Standard",
                  "Fifth Standard",
                  "Sixth Standard",
                  "Seventh Standard",
                  "Eighth Standard", 
                  "Ninth Standard",
                  "Tenth Standard",
                  "Eleventh Standard",
                  "Twelth Standard"
              ]
  
  var batches=[]
  var batch_map={}
  
  for(i=0;i<12;i++)
  {
  if((date.getMonth()+1)>=6)
  var batch_date=date.getFullYear()-i
  else
  batch_date=date.getFullYear()-1-i
  batches.push((batch_date)+"-"+(batch_date+1))
  }
   
  for(i=0;i<12;i++){
      var batch=batches[i]
      var _class=classes[i]
      batch_map[batch]=_class
  }
  
  
  return batch_map;
  
  }

const batches_and_classes=batch_map()




exports.classes_map=batches_and_classes

