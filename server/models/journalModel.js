const mongoose = require("mongoose");
const journal = new mongoose.Schema({
    creatorId:{
        type:mongoose.Schema.ObjectId,
        required:true,
    },
    title:{
        type:String,
        required:[true, "Please Enter Title for the journal"],
        trim:true,
    },
    content:{
        type:String,
        required:[true, "Please Enter journal content"],
    },
       
    images:[
        {
            public_id:{
                type:String,
                required:true,
            },
            url:{
                type:String,
                required:true,
            },
        }
    ],
    
    tags:[
        {
        type:String,
        required:[true, "Please enter tags"],

        }
    ],

    createdAt:{
        type:Date,
        default:Date.now,
    },
   
    
})

journal.index({ title: 'text', content:'text'});

module.exports = mongoose.model("Journal", journal);
