const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema({
    postId:{
        type:mongoose.Schema.ObjectId,
        required:true
    },
    creatorId:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    }
    ,
    comment:{
        type:String,
        required:true,
    },
    commentedAt:{
        type:Date,
        default:Date.now(),
    },
    edited:{
        type:Boolean,
        default:false
    },
    // replies:[
    //     {
    //         creatorId:{
    //             type:mongoose.Schema.ObjectId,
    //         },
    //         reply:{
    //             type:String
    //         },
    //         repliedAt:{
    //             type:Date,
    //             default:Date.now()
    //         },
    //         edited:{
    //             type:Boolean,
    //             default:false
    //         }
    //     }
    // ]
})


module.exports = mongoose.model("Comment", commentSchema);