const Journal = require("../models/journalModel.js");
const User = require("../models/userModel.js");
const ErrorHandler = require("../utils/errorHandler.js");


// creata journal
exports.createJournal = async(req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        
        const journal = await Journal.create({
            creatorId:user.id,
            ...req.body
        })

        res.status(200).json({
            success:true,
            journal,
            message:"Journal created successfully!"
        })
        
    } catch (error) {
        next(new ErrorHandler(error.message));
    }
}

// edit a journal
exports.editJournal = async(req, res, next) => {
    try {
        let journal = await Journal.findById(req.params.journalId);
        if (!journal){
            return next(new ErrorHandler(`Journal not found`));
        }

        // check if the post is created by the requesting user
        if (journal.creatorId.toString() !== req.user.id){
            return next(new ErrorHandler(`User not allowed to update this journal`));    
        }

        journal = await Journal.findByIdAndUpdate(req.params.journalId, req.body,{
            new:true,
            runValidators:true,
            useFindAndModify:false,
        });

        res.status(200).json({
            success:true,
            message:`Journal updated`,
            journal
        });

        
    } catch (error) {
        next(new ErrorHandler(error.message));
    }
}

// delete a journal
exports.deleteJournal = async(req, res, next) => {
    try {
        const journal = await Journal.findById(req.params.journalId);
        if (!journal){
            return next(new ErrorHandler(`Journal not found`));
        }

        // check if the post is created by the requesting user
        if (journal.creatorId.toString() !== req.user.id){
            return next(new ErrorHandler(`User not allowed to delete this journal`));    
        }

        // TODO: we will remove cloudinary 

        await journal.remove();
        res.status(200).json({
            success:true,
            message:"Journal deleted successfully!"
        });
    } catch (error) {
        next(new ErrorHandler(error.message));
    }
}
// show all journal that are yours --while filtering them based on title and content --- keyword
exports.showJournals = async(req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        const keyword = req.body.keyword ? req.body.keyword : "";
        const query = {$or:[{ title: { $regex: keyword, $options: "i" }}, {content:  { $regex: keyword, $options: "i" }}] };
        const projection = { _id: 1, title: 1 };
        
        const journals = await Journal.find(query, projection);
    
        res.status(200).json({
          success: true,
          journals,
        });
      } catch (error) {
        next(new ErrorHandler(error.message));
      }
}


// get a journal details
exports.getAJournal = async(req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        const journal = await Journal.find({
            creatorId:user.id,
            _id:req.params.journalId
        })
        if (!journal){
            return next(new ErrorHandler(`No such journal exists with that id`));         
        }

        res.status(200).json({
            success:true,
            journal
        })
        
    } catch (error) {
        next(new ErrorHandler(error.message));
    }
}
