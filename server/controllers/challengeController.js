const Challenge = require("../models/challengeModel.js");
const User = require("../models/userModel.js");
const Motivation = require("../models/postModel.js");

const ErrorHandler = require("../utils/errorHandler.js");
const {
    createAPost,
    

} = require("../controllers/postController.js");

// create challenge
exports.createChallenge = async(req, res, next) => {
    try {
        console.log("here in creating a challenge")
        const user = await User.findById(req.user.id);
        const challenge = await Challenge.create({
            creatorId:user.id,
            ...req.body
        })

        challenge.joinedUsers.push({
            userId:user.id
        })

        // TODO user onGoingCHallenges

        user.onGoingChallenges.push(challenge.id);
        await user.save();
        // TODO challenges checkenIN create
        challenge.checkedIn.push({
            userId:user.id,
            streak:0,
            latestReport:"Just Joined"

        })

        await challenge.save();
        // createAPost("")
        
        const post = await Motivation.create({
            creatorId:user.id,
            title:challenge.title,
            content:"A NEW CHALLENGE IS HERE 😃",
            challenge:challenge._id
        })

        res.status(200).json({
            success:true,
            challenge,
            message:"Challenge created successfully!"
        })
        
    } catch (error) {
        next(new ErrorHandler(error.message));
    }
}

// update challenge
exports.updateAChallenge = async(req, res, next)=>{
    try{
        let challenge = await Challenge.findById(req.params.challengeId);
        if (!challenge){
            return next(new ErrorHandler(`Challenge not found`));
        }

        // check if the challenge is created by the requesting user
        if (challenge.creatorId.toString() !== req.user.id){
            return next(new ErrorHandler(`User not allowed to update this challenge`));    
        }

        challenge = await Challenge.findByIdAndUpdate(req.params.challengeId, req.body,{
            new:true,
            runValidators:true,
            useFindAndModify:false,
        });

        res.status(200).json({
            success:true,
            message:`Challenge updated`,
            challenge
        });
    } 
    catch(error){
        next(new ErrorHandler(error.message));
    }
}


// delete challenge
// Not allowed to delete a challenge
exports.deleteAChallenge = async(req, res, next)=>{
    try{
        const challenge = await Challenge.findById(req.params.challengeId);
        if (!challenge){
            return next(new ErrorHandler(`Challenge not found`));
        }

        // check if the challenge is created by the requesting user
        if (challenge.creatorId.toString() !== req.user.id){
            return next(new ErrorHandler(`User not allowed to delete this challenge`));    
        }

        // TODO: we will remove cloudinary 

        // TODO user ongoing challenges
        // TODO user ongoing challenges

        await challenge.remove();
        res.status(200).json({
            success:true,
            message:"Challenge deleted successfully!"
        });
    
    } 
    catch(error){
        next(new ErrorHandler(error.message));
    }
}

// join a challenge
exports.joinAChallenge = async(req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        const challenge = await Challenge.findById(req.params.challengeId);

        if (!challenge){
            return next(new ErrorHandler(`Challenges not found`));
        }

        // if (!challenge.public){
        //     return next(new ErrorHandler(`Challenge not found`));

        // }
        challenge.checkedIn.push({
            userId:user.id,
            streak:0,
            latestReport:"Just Joined"

        })


        // check if the user had quitted the challenge
         if (user.failedChallenges.includes(challenge.id)){
            return next(new ErrorHandler(`Challenge already quitted. Cannot rejoin`));
 
        }

        challenge.joinedUsers.push({
            userId:user.id
        });

        await challenge.save();

        // TODO user ongoing challenges
        user.onGoingChallenges.push(challenge.id);
        await user.save();

        const post = await Motivation.create({
            creatorId:user.id,
            title:challenge.title,
            content:"A NEW CHALLENGEE JOINED 😃",
            challenge:challenge._id
        })

        res.status(200).json({
            success:true,
            challenge,
            message:"A new user joined the challenge!"
        });

    } catch (error) {
        next(new ErrorHandler(error.message));     
    }
}


// upvote a challenge
exports.upvoteChallenge = async(req, res, next)=>{
    try{
        console.log("Here in upvote")

        const user = await User.findById(req.user.id);
        let challenge = await Challenge.findById(req.params.challengeId);
        if (!challenge){
            return next(new ErrorHandler(`Challenge not found`));
        }
        //unlike if already liked
        if (challenge.upvotes.includes(user.id)){
            challenge.upvotes = challenge.upvotes.filter((upvote, id)=>{
                return upvote.toString() !== req.user.id
            })
        }
        // upvote if not upvoted
        else{
            challenge.upvotes.push(user.id);
        }

        await challenge.save();
        res.status(200).json({
            success:true,
            userId:user._id,
            challenge,
            message:"Upvote Toggled for this challenge"
        })



    } 
    catch(error){
        next(new ErrorHandler(error.message));
    }
}

// rate the challenge - one user - one rate
// for this one, I think updateChallenge will be equivalent

// daily report on a challenge 
// to check in user will have to click on check in - feedback optional
exports.dailyCheckInOnAChallenge = async(req, res, next) => {
    try {

        const user = await User.findById(req.user.id);
        const challenge = await Challenge.findById(req.params.challengeId);
        // TODO check if the challenge exists 
        if (!challenge){
            return next(new ErrorHandler(`Challenge with id ${req.params.challengeId} does not exist`));
        }
        

        if (!user.onGoingChallenges.includes(challenge.id)){
            return next(new ErrorHandler(`User is not an ongoing challengee`));

        }

        let message ="Daily check-in updated successfully!";

        challenge.checkedIn.map((challengee, index)=>{
            if (challengee.userId.toString() == user.id.toString()){
                console.log("IN DAILY CHECK In")

                 // check if it has been more than or equal to 24 hours since the last message
                const lastReported = new Date(challengee.lastReported);
                const now = new Date();
                const timeElapsed = now.getTime() - lastReported.getTime();
                const hoursElapsed = timeElapsed / (1000 * 60 * 60);
                console.log(hoursElapsed);
                if (hoursElapsed >= 24) {
                    // increase streak if eligible
                    challengee.streak += 1;
                    challengee.lastReported = Date.now();
                    challengee.checkedIn = true;
                    challengee.latestReport = req.body.message;

                }
                else{
                    message="Already checked in for today"
                }
                }
        })

        await challenge.save();
        res.status(200).json({
            success:true,
            challenge,
            message
        });
    
    } catch (error) {
        next(new ErrorHandler(error.message));

    }
}

// utility function to check if two dates are on the same day
function isSameDay(date1, date2) {
    return date1.getFullYear() === date2.getFullYear()
        && date1.getMonth() === date2.getMonth()
        && date1.getDate() === date2.getDate();
}

exports.getCheckedInMessages = async (req, res, next) => {
    try {
      const challengeId = req.params.challengeId;
  
      // Find the challenge and populate checkedIn array with user info
      const challenge = await Challenge.findById(challengeId).populate({
        path: 'checkedIn.userId',
        select: 'name',
      });
  
      if (!challenge) {
        return next(new ErrorHandler(`Challenge with id ${challengeId} does not exist`));
      }
  
      // Find all checked-in messages with user names and IDs
      const checkedInMessages = challenge.checkedIn.map((checkIn) => {
        return {
          userId: checkIn.userId._id,
          name: checkIn.userId.name,
          latestReport: checkIn.latestReport,
        };
      });
  
      // Sort checked-in messages with logged-in user's message at top
      const loggedInUser = req.user.id.toString();
      checkedInMessages.sort((a, b) => {
        if (a.userId.toString() === loggedInUser) return -1;
        if (b.userId.toString() === loggedInUser) return 1;
        return 0;
      });
  
      res.status(200).json({
        success: true,
        checkedInMessages,
      });
    } catch (error) {
      next(new ErrorHandler(error.message));
    }
  };
  

// SEE IF STREAK IS LOST for a challenge
// i see this function being called when the user visits that challenge
exports.checkStreak = async(req, res, next) => {
    try {
        console.log("Here in checking streak")
        const user = await User.findById(req.user.id);
        const challenge = await Challenge.findById(req.params.challengeId);

        if (!challenge){
            return next(new ErrorHandler(`Challenge does not exist`));
   
        }

        if (!user.onGoingChallenges.includes(challenge.id)){
            return next(new ErrorHandler(`User is not an ongoing challengee`));

        }

        let streak = 0;
        challenge.checkedIn.map((challengee, index)=>{
            if (challengee.userId.toString() == user.id.toString()){
                
                 // check if it has been more than or equal to 24 hours since the last message
                const lastReported = new Date(challengee.lastReported);
                const now = new Date();
                const timeElapsed = now.getTime() - lastReported.getTime();
                const hoursElapsed = timeElapsed / (1000 * 60 * 60);
                if (hoursElapsed >= 48) {
                    // increase streak if eligible
                    challengee.streak = 0;
                }
                streak = challengee.streak;
                }
        })
        // if (streak === challenge.duration){
        //     console.log("COMPLETING THE CHALLENGE")
        //     await this.completeChallenge();
        // }
        console.log(streak)
        await challenge.save();
        res.status(200).json({
            success:true,
            message:"Streak checked!",
            streak,
        });

    } catch (error) {
        next(new ErrorHandler(error.message));

    }
}


// completed a challenge
// This will be called when the streak equals duration
exports.completeChallenge = async(req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        const challenge = await Challenge.findById(req.params.challengeId);
        if (!challenge){
            return next(new ErrorHandler(`Challenge with id ${req.params.id} does not exist`));
        }

        
        if (user.completedChallenges.includes(challenge.id)){
            return next(new ErrorHandler(`Challenge already completed`));
 
        }

        // TODO checks----
       
        user.onGoingChallenges.map((ch)=>{
        
            if (ch.toString() == challenge.id.toString()){
                user.completeChallenge(challenge.id);
                return true;
     
            }  
          
        })
        challenge.joinedUsers.map((jUser, ind)=>{   
            if (jUser.userId.toString() === user.id.toString()){
                jUser.completed = true;
                return true;
            }
           
        })
        
        await challenge.save();

        const post = await Motivation.create({
            creatorId:user.id,
            title:challenge.title,
            content:` EXCITING NEWS! ${user.name} completed the challenge😃. ${user.name}'s level is now ${user.level}` ,
            challenge:challenge._id
        })
       
        res.status(200).json({
            success:true,
            message:"Challenge completed",
            challenge,
        })



        
    } catch (error) {
        next(new ErrorHandler(error.message));

    }
}


// quitting a challenge
exports.quitAChallenge = async(req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        const challenge = await Challenge.findById(req.params.challengeId);
        if (!challenge){
            return next(new ErrorHandler(`Challenge with id ${req.params.id} does not exist`));
        }

        if (user.completedChallenges.includes(challenge.id)){
            return next(new ErrorHandler(`Challenge already completed. Cannot quit`));
 
        }
        if (user.failedChallenges.includes(challenge.id)){
            return next(new ErrorHandler(`Challenge already quitted`));
 
        }


        if (!user.onGoingChallenges.includes(challenge.id)){
            return next(new ErrorHandler(`User has not joined the challenge. So Cannot quit`));
 
        }



        challenge.joinedUsers.map((jUser, ind)=>{
            if (jUser.userId.toString() === user._id.toString()){
                jUser.streak = 0;
                jUser.quit = true;
            }
            return;
        })

        await challenge.save();

        // TODO user quit challenges
        // TODO user ongoing challenges
        user.markChallengeAsFailed(challenge.id);

        const post = await Motivation.create({
            creatorId:user.id,
            title:challenge.title,
            content:` Too BAD! ${user.name} quit the challenge😞`,
            challenge:challenge._id
        })

        res.status(200).json({
            success:true,
            challenge,
            message:"User quitted the challenge"
        })


    } catch (error) {
        next(new ErrorHandler(error.message));
    }
}


// share a challenge
exports.shareAChallenge = async(req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        const challenge = await Challenge.findById(req.params.challengeId);
        if (!challenge){
            return next(new ErrorHandler(`Challenge with id ${req.params.id} does not exist`));
        }


        res.status(200).json({
            success:true,
            shareId:req.params.id,

        })


        
    } catch (error) {
        next(new ErrorHandler(error.message));

    }
}


// get all challenges for a user has interacted with
exports.getChallenges = async (req, res) => {
    try {
        console.log("here in getcha")
        const {userId} = req.body;
        const user = await User.findById(userId).populate("completedChallenges onGoingChallenges failedChallenges");
    console.log(user.name, req.body);
    // console.log(userId)
      const createdChallenges = await Challenge.find({ creatorId: user._id });
     

      res.status(200).json({
        createdChallenges,
        joinedChallenges:user.onGoingChallenges,
        quitChallenges:user.failedChallenges,
        completedChallenges:user.completedChallenges,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  
exports.getAllChallenges = async(req, res, next) => {
    try {
        
        const challenges = await Challenge.find();

        res.status(200).json({
            success:true,
            challenges
        })
    } catch (error) {
        next(new ErrorHandler(error.message));

    }
}

// get a challenge
exports.getAChallenge = async(req, res, next) => {
    try {
        console.log("getAchallenge")
        const challenge = await Challenge.findById(req.params.challengeId);
        if (!challenge){
            return next(new ErrorHandler(`Challenge with id ${req.params.challengeId} does not exist`));
        }

        res.status(200).json({
            success:true,
            challenge
        })
        
    } catch (error) {
        next(new ErrorHandler(error.message));

    }
}

// search challenges by title
exports.searchChallenges = async(req, res, next) => {
    try {
        console.log("Here in search challenges")
        const keyword = req.body.keyword ? req.body.keyword : "";
        const tags = req.body.tags ? req.body.tags : [""];
        console.log(tags)
        // filter by tags not working
        const query = {
            $and: [

               {$or:[{ title: { $regex: keyword, $options: "i" }}, 
               { challenge: { $regex: keyword, $options: "i" }}, ] }
                ,
                {  tags: {
                    $in: tags.map(tag => new RegExp(tag, 'i'))
                  }}
            ]
        };
        // const projection = { _id: 1, title: 1 };
        const challenges = await Challenge.find(query).sort("-upvotes");
        res.status(200).json({
            success: true,
            challenges,
          });
        
    } catch (error) {
        next(new ErrorHandler(error.message));

    }
}

// get all followed challenges
exports.getAllFollowedChallenges = async(req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        // user.following
        if (!user){
            return next(new ErrorHandler(`User does not exist!`));
        }
        const keyword = req.body.keyword ? req.body.keyword : "";
        const tags = req.body.tags ? req.body.tags : [""];
        console.log(tags)
        // filter by tags not working
        const query = {
            $and: [

               {$or:[{ title: { $regex: keyword, $options: "i" }}, 
               { challenge: { $regex: keyword, $options: "i" }}, ] }
                ,
                {  tags: {
                    $in: tags.map(tag => new RegExp(tag, 'i'))
                  }}
            ]
        };
        const followingUsers = user.following;
        const challenges = [];

        for (let i = 0; i < followingUsers.length; i++){
            
            let followingUser = await User.findById(followingUsers[i]); 
            
            let challengesUser = await Challenge.find({
                creatorId:followingUser.id, ...query
            }).sort("-upvotes");           
            challenges.push(...challengesUser);
        }

        res.status(200).json({
            success:true,
            challenges
        })
        
    } catch (error) {
        next(new ErrorHandler(error.message));

    }
}

//get challenges that I created
exports.getChallengesCreatedByMe = async(req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        const keyword = req.body.keyword ? req.body.keyword : "";
        const tags = req.body.tags ? req.body.tags : [""];
        console.log(tags)
        // filter by tags not working
        const query = {
            $and: [

               {$or:[{ title: { $regex: keyword, $options: "i" }}, 
               { challenge: { $regex: keyword, $options: "i" }}, ] }
                ,
                {  tags: {
                    $in: tags.map(tag => new RegExp(tag, 'i'))
                  }}
            ]
        };
        const challenges = await Challenge.find({
            creatorId:user.id, ...query
        }).sort("-upvotes")

        res.status(200).json({
            success:true,
            challenges,
            message:"All challenges for a user"
        })
        
    } catch (error) {
        next(new ErrorHandler(error.message));

    }
}

// get all of my joined challenges- completed quitted joined created

// get all challenges by a user - that the user has joined -- this and the below controller is the same
// TODO merge them
// I am only returning the ids themselves and not the challenges
exports.getAllChallengesByAUser = async(req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user){
            return next(new ErrorHandler(`User does not exist`));      
        }
        let allChallenges = [];
        // get the ongoing challenges
        // get the completed challenges
        // get the quitted/failer challenges
        allChallenges.push(...user.onGoingChallenges, ...user.failedChallenges, ...user.completedChallenges);  
        res.status(200).json({
            success:true,
            allChallenges
        })   
        
    } catch (error) {
        next(new ErrorHandler(error.message));  
    }
}


// get my challenges - challenges that I have joined
exports.getMyChallenges = async(req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user){
            return next(new ErrorHandler(`User does not exist`));
        }

        let allChallenges = [];
        // get the ongoing challenges
        // get the completed challenges
        // get the quitted/failer challenges
        allChallenges.push(...user.onGoingChallenges, ...user.failedChallenges, ...user.completedChallenges);  
        res.status(200).json({
            success:true,
            allChallenges
        })   
    } catch (error) {
        next(new ErrorHandler(error.message));
    }
}

// get all upvoters name for a challenge
exports.getAllUpvotesForAChallenge = async(req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        const challenge = await Challenge.findById(req.params.challengeId);
        if (!challenge){
            return next(new ErrorHandler(`Challenge with id ${req.params.id} does not exist`));
        }

        let upvoters = [];
        console.log(challenge.upvotes)

        for (let i = 0; i < challenge.upvotes.length; i++){
            let upvoter = await User.findById(challenge.upvotes[i]);
            // we will be fetching the name and id for each user
            upvoters.push(upvoter.name);
        }

        res.status(200).json({
            success:true,
            upvotes:challenge.upvotes,
            upvoters
        })
        
    } catch (error) {
        next(new ErrorHandler(error.message));

    }
}