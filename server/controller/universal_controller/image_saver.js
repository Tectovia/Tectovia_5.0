
function image_saver(image,middle_name,filepath,id){
    var new_name;
    if (!image) {
      console.log("No File Upload!");
      return "null"
    } else {
      let date = new Date().toLocaleDateString("de-DE");
      const file_format = image.name.slice(((image.name.lastIndexOf(".") - 1) >>> 0) + 2 );

      
      new_name =middle_name + date + "." + file_format;
       var uploadpath =filepath + new_name;
  
      image.mv(uploadpath, function (err) {
        if (err)
         console.log(err);
      });
      console.log(new_name);
      return new_name;
    }
  }

  module.exports=image_saver;
  