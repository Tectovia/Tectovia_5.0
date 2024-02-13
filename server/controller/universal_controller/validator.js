const { ObjectId } = require("mongodb");

exports.validator=(req,res,next)=>{
    if(req.session.id){
      const params_id=req.params.id;
      const session_id=req.session.user_id;
      const session_obj_id=req.session.obj_id;
      
      

     
     
      if(params_id===session_id||params_id===session_obj_id){
        
          next();
  
      }
      else{
          console.log("illegal Entry!!!!!");
          // req.session.destroy();
          res.redirect('/')
      }
    }
     else{
       res.redirect('/');
     }
  }
  
  exports.admin_validator=(req,res,next)=>{
    if(req.session.id){
        if (req.session.role=='admin') {
          next();
        }
        else{
          res.redirect('/');
        }
    }
    else{
      res.redirect('/');
    }
  }
  
  