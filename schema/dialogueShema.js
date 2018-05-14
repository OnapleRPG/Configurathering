const mongoose = require("mongoose");
let dialogueShema = mongoose.Schema({
   _id : Number,
    trigger: [String],

   pages : [{
       text: String,
       button:[
           {
               color : String,
               text : String,
               action:[
                   {
                       name : String,
                       args : String
                   }
               ]
           }
       ]
   }
   ]
});
exports.Dialogue = mongoose.model('Dialogue', dialogueShema);