const mongoose = require("mongoose");
const notification = new mongoose.Schema({
   
    message:{
        type:String,
        required:[true, "Please Enter notfication message"],
    },

    userId:{
        type:mongoose.Schema.ObjectId,
        required:true,
    },

    seen:{
        type:Boolean,
        default:false,
    },
       
    createdAt:{
        type:Date,
        default:Date.now,
    }
    
})


module.exports = mongoose.model("Notification", notification);