const Challenge = require("../models/challengeModel.js");
const User = require("../models/userModel.js");
const Motivation = require("../models/postModel.js");

const ErrorHandler = require("../utils/errorHandler.js");
const {
    createAPost,
    

} = require("../controllers/postController.js");

/**/
/*
createChallenge()
NAME
    createChallenge - Creates a new challenge and performs associated actions.
SYNOPSIS
    createChallenge = async (req, res, next) => {...};
    req -> Request object containing the challenge details.
    res -> Response object that carries the challenge information and status code back to the client.
    next -> The next middleware function in the pipeline.
DESCRIPTION
    This function creates a new challenge, associates it with a user, and performs related actions such as
    adding the challenge to the user's ongoing challenges and creating a motivation post.
RETURNS
    None.
*/
/**/
exports.createChallenge = async (req, res, next) => {
    try {
        console.log("here in creating a challenge");

        // Find the user by ID
        const user = await User.findById(req.user.id);

        // Create a new challenge using the provided data and the creator's ID
        const challenge = await Challenge.create({
            creatorId: user.id,
            ...req.body,
        });

        // Add the user to the list of joined users for this challenge
        challenge.joinedUsers.push({
            userId: user.id,
        });

        // Add the challenge to the user's list of ongoing challenges
        user.onGoingChallenges.push(challenge.id);
        await user.save();

        // Create an initial check-in record for the user in the challenge
        challenge.checkedIn.push({
            userId: user.id,
            streak: 0,
            latestReport: "Just Joined",
        });
        await challenge.save();

        // Create a motivation post related to the new challenge
        const post = await Motivation.create({
            creatorId: user.id,
            title: challenge.title,
            content: "A NEW CHALLENGE IS HERE 😃",
            challenge: challenge._id,
        });

        // Respond with success and challenge information
        res.status(200).json({
            success: true,
            challenge,
            message: "Challenge created successfully!",
        });
    } catch (error) {
        // Handle errors by passing them to the error handling middleware
        next(new ErrorHandler(error.message));
    }
}
/* createChallenge = async (req, res, next) => {...}; */


/**/
/*
updateAChallenge()
NAME
    updateAChallenge - Update a challenge's details.
SYNOPSIS
    updateAChallenge = async (req, res, next) => {...};
    req -> Request object containing the challenge update details.
    res -> Response object that carries the updated challenge information and status code back to the client.
    next -> The next middleware function in the pipeline.
DESCRIPTION
    This function updates the details of a challenge if it exists and is created by the requesting user.
RETURNS
    None.
*/
/**/
exports.updateAChallenge = async (req, res, next) => {
    try {
        // Find the challenge by ID
        let challenge = await Challenge.findById(req.params.challengeId);
        
        // Check if the challenge exists
        if (!challenge) {
            return next(new ErrorHandler(`Challenge not found`));
        }

        // Check if the challenge is created by the requesting user
        if (challenge.creatorId.toString() !== req.user.id) {
            return next(new ErrorHandler(`User not allowed to update this challenge`));
        }

        // Update the challenge with the provided request body
        challenge = await Challenge.findByIdAndUpdate(req.params.challengeId, req.body, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        });

        // Respond with success and the updated challenge information
        res.status(200).json({
            success: true,
            message: `Challenge updated`,
            challenge,
        });
    } catch (error) {
        // Handle errors by passing them to the error handling middleware
        next(new ErrorHandler(error.message));
    }
}
/* updateAChallenge = async (req, res, next) => {...}; */


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
/**/
/*
joinAChallenge()
NAME
    joinAChallenge - Allow a user to join a challenge.
SYNOPSIS
    joinAChallenge = async (req, res, next) => {...};
    req -> Request object containing the user and challenge information.
    res -> Response object that carries the updated challenge information and status code back to the client.
    next -> The next middleware function in the pipeline.
DESCRIPTION
    This function allows a user to join a challenge. It updates the challenge's participants and the user's ongoing challenges.
RETURNS
    None.
*/
/**/
exports.joinAChallenge = async (req, res, next) => {
    try {
        // Find the user and challenge by their respective IDs
        const user = await User.findById(req.user.id);
        const challenge = await Challenge.findById(req.params.challengeId);

        // Check if the challenge exists
        if (!challenge) {
            return next(new ErrorHandler(`Challenge not found`));
        }

        // Add the user to the challenge's checked-in participants
        challenge.checkedIn.push({
            userId: user.id,
            streak: 0,
            latestReport: "Just Joined",
        });

        // Check if the user had quit the challenge before
        if (user.failedChallenges.includes(challenge.id)) {
            return next(new ErrorHandler(`Challenge already quitted. Cannot rejoin`));
        }

        // Add the user to the challenge's participants
        challenge.joinedUsers.push({
            userId: user.id,
        });

        // Save the updated challenge
        await challenge.save();

        // Add the challenge to the user's ongoing challenges
        user.onGoingChallenges.push(challenge.id);
        await user.save();

        // Create a post to announce the user's join
        const post = await Motivation.create({
            creatorId: user.id,
            title: challenge.title,
            content: "A NEW CHALLENGE JOINED 😃",
            challenge: challenge._id,
        });

        // Respond with success and the updated challenge information
        res.status(200).json({
            success: true,
            challenge,
            message: "A new user joined the challenge!",
        });

    } catch (error) {
        // Handle errors by passing them to the error handling middleware
        next(new ErrorHandler(error.message));
    }
}
/* joinAChallenge = async (req, res, next) => {...}; */



/**/
/*
upvoteChallenge()
NAME
    upvoteChallenge - Allow a user to upvote a challenge.
SYNOPSIS
    upvoteChallenge = async (req, res, next) => {...};
    req -> Request object containing user and challenge information.
    res -> Response object that carries the updated challenge information and status code back to the client.
    next -> The next middleware function in the pipeline.
DESCRIPTION
    This function allows a user to toggle the upvote status for a challenge. It either adds or removes the user's upvote.
RETURNS
    None.
*/
/**/
exports.upvoteChallenge = async (req, res, next) => {
    try {
        console.log("Here in upvote");

        // Find the user and challenge by their respective IDs
        const user = await User.findById(req.user.id);
        let challenge = await Challenge.findById(req.params.challengeId);

        // Check if the challenge exists
        if (!challenge) {
            return next(new ErrorHandler(`Challenge not found`));
        }

        // Toggle the upvote status
        // Unlike if already liked
        if (challenge.upvotes.includes(user.id)) {
            challenge.upvotes = challenge.upvotes.filter((upvote) => {
                return upvote.toString() !== req.user.id;
            });
        }
        // Upvote if not upvoted
        else {
            challenge.upvotes.push(user.id);
        }

        // Save the updated challenge
        await challenge.save();

        // Respond with success and the updated challenge information
        res.status(200).json({
            success: true,
            userId: user._id,
            challenge,
            message: "Upvote Toggled for this challenge",
        });

    } catch (error) {
        // Handle errors by passing them to the error handling middleware
        next(new ErrorHandler(error.message));
    }
}
/* upvoteChallenge = async (req, res, next) => {...}; */




/**/
/*
dailyCheckInOnAChallenge()
NAME
    dailyCheckInOnAChallenge - Allows a user to perform a daily check-in on a challenge.
SYNOPSIS
    dailyCheckInOnAChallenge = async (req, res, next) => {...};
    req -> Request object containing user, challenge, and check-in details.
    res -> Response object that carries the updated challenge information and status code back to the client.
    next -> The next middleware function in the pipeline.
DESCRIPTION
    This function allows a user to perform a daily check-in on a challenge. It checks if the user is part of the ongoing challenge, 
    and if the last check-in was performed more than 24 hours ago, it increases the user's streak and updates the check-in status.
RETURNS
    None.
*/
/**/
exports.dailyCheckInOnAChallenge = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        const challenge = await Challenge.findById(req.params.challengeId);

        // Check if the challenge exists
        if (!challenge) {
            return next(new ErrorHandler(`Challenge with id ${req.params.challengeId} does not exist`));
        }

        // Check if the user is part of the ongoing challenge
        if (!user.onGoingChallenges.includes(challenge.id)) {
            return next(new ErrorHandler(`User is not an ongoing challenger`));
        }

        let message = "Daily check-in updated successfully!";

        // Iterate through challenge participants
        challenge.checkedIn.map((challengee, index) => {
            if (challengee.userId.toString() === user.id.toString()) {
                console.log("IN DAILY CHECK-IN");

                // Check if it has been more than or equal to 24 hours since the last check-in
                const lastReported = new Date(challengee.lastReported);
                const now = new Date();
                const timeElapsed = now.getTime() - lastReported.getTime();
                const hoursElapsed = timeElapsed / (1000 * 60 * 60);
                console.log(hoursElapsed);

                if (hoursElapsed >= 24) {
                    // Increase streak if eligible
                    challengee.streak += 1;
                    challengee.lastReported = Date.now();
                    challengee.checkedIn = true;
                    challengee.latestReport = req.body.message;
                } else {
                    message = "Already checked in for today";
                }
            }
        });

        // Save the updated challenge
        await challenge.save();

        // Respond with success and the updated challenge information
        res.status(200).json({
            success: true,
            challenge,
            message,
        });

    } catch (error) {
        // Handle errors by passing them to the error handling middleware
        next(new ErrorHandler(error.message));
    }
}
/* dailyCheckInOnAChallenge = async (req, res, next) => {...}; */


/**/
/*
isSameDay()
NAME
    isSameDay - Utility function to check if two dates are on the same day.
SYNOPSIS
    isSameDay(date1, date2);
    date1 -> The first date to compare.
    date2 -> The second date to compare.
DESCRIPTION
    This utility function compares two date objects and returns true if they represent the same day (year, month, and day).
RETURNS
    Returns true if both dates are on the same day, otherwise returns false.
*/
/**/
function isSameDay(date1, date2) {
    return date1.getFullYear() === date2.getFullYear()
        && date1.getMonth() === date2.getMonth()
        && date1.getDate() === date2.getDate();
}
// isSameDay(date1, date2);

/**/
/*
getCheckedInMessages()
NAME
    getCheckedInMessages - Retrieves checked-in messages for a challenge.
SYNOPSIS
    getCheckedInMessages = async (req, res, next) => {...};
    req -> Request object containing challenge ID.
    res -> Response object that carries checked-in messages along with user info and status code.
    next -> The next middleware function in the pipeline.
DESCRIPTION
    This function retrieves checked-in messages for a specific challenge. It finds the challenge, populates the checked-in array with user info,
    and sorts the messages with the logged-in user's message at the top.
RETURNS
    None.
*/
/**/
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
      // Handle errors by passing them to the error handling middleware
      next(new ErrorHandler(error.message));
    }
  };
/* getCheckedInMessages = async (req, res, next) => {...}; */


/**/
/*
checkStreak()
NAME
    checkStreak - Checks if a user's streak is lost for a challenge.
SYNOPSIS
    checkStreak = async (req, res, next) => {...};
    req -> Request object containing user and challenge details.
    res -> Response object that carries the user's streak information and status code.
    next -> The next middleware function in the pipeline.
DESCRIPTION
    This function is used to determine if a user's streak is lost for a specific challenge. It checks if the challenge exists,
    if the user is part of the ongoing challenge, and if the last check-in was performed more than 48 hours ago. If so, the user's streak is reset.
RETURNS
    None.
*/
/**/
exports.checkStreak = async (req, res, next) => {
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
/* checkStreak = async (req, res, next) => {...}; */


/**/
/*
completeChallenge()
NAME
    completeChallenge - Marks a challenge as completed when a user's streak equals the challenge duration.
SYNOPSIS
    completeChallenge = async (req, res, next) => {...};
    req -> Request object containing user and challenge details.
    res -> Response object that carries the updated challenge information and status code back to the client.
    next -> The next middleware function in the pipeline.
DESCRIPTION
    This function is called when a user's streak equals the duration of a challenge. It marks the challenge as completed for the user, updates their level,
    and creates a completion post. The challenge is also updated to reflect the user's completion.
RETURNS
    None.
*/
/**/
exports.completeChallenge = async (req, res, next) => {
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
/* completeChallenge = async (req, res, next) => {...}; */



/**/
/*
quitAChallenge()
NAME
    quitAChallenge - Allows a user to quit an ongoing challenge.
SYNOPSIS
    quitAChallenge = async (req, res, next) => {...};
    req -> Request object containing user and challenge details.
    res -> Response object that carries the updated challenge information and status code back to the client.
    next -> The next middleware function in the pipeline.
DESCRIPTION
    This function allows a user to quit an ongoing challenge. It checks various conditions, including whether the challenge exists, 
    whether the user has already completed or quit the challenge, and whether the user has joined the challenge.
    If all conditions are met, the user's streak is reset, and they are marked as quitting the challenge.
    The user's challenges are updated accordingly, and a quitting post is created.
RETURNS
    None.
*/
/**/
exports.quitAChallenge = async (req, res, next) => {
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
/* quitAChallenge = async (req, res, next) => {...}; */


/**/
/*
shareAChallenge()
NAME
    shareAChallenge - Allows a user to share a challenge with others.
SYNOPSIS
    shareAChallenge = async (req, res, next) => {...};
    req -> Request object containing user and challenge details.
    res -> Response object that carries the share ID and status code back to the client.
    next -> The next middleware function in the pipeline.
DESCRIPTION
    This function allows a user to share a challenge with others. It retrieves the user and challenge information, 
    and if the challenge exists, it responds with a success status and a share ID. The actual sharing functionality
    would typically involve sending this share ID as a parameter or in a link for others to access the challenge.
RETURNS
    None.
*/
/**/
exports.shareAChallenge = async (req, res, next) => {
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
/* shareAChallenge = async (req, res, next) => {...}; */


/**/
/*
getChallenges()
NAME
    getChallenges - Retrieves all challenges related to a user.
SYNOPSIS
    getChallenges = async (req, res) => {...};
    req -> Request object containing user ID for whom challenges are to be retrieved.
    res -> Response object that carries various challenge lists for the user.
DESCRIPTION
    This function retrieves all challenges associated with a user, including created, joined, quit, and completed challenges.
    It takes the user's ID as input and populates challenge lists accordingly.
RETURNS
    None.
*/
/**/
exports.getChallenges = async (req, res) => {
    try {
        console.log("here in getcha");
        const { userId } = req.body;
        const user = await User.findById(userId).populate("completedChallenges onGoingChallenges failedChallenges");
        console.log(user.name, req.body);

        const createdChallenges = await Challenge.find({ creatorId: user._id });

        res.status(200).json({
            createdChallenges,
            joinedChallenges: user.onGoingChallenges,
            quitChallenges: user.failedChallenges,
            completedChallenges: user.completedChallenges,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
/* getChallenges = async (req, res) => {...}; */


  
/**/
/*
getAllChallenges()
NAME
    getAllChallenges - Retrieves all challenges available in the system.
SYNOPSIS
    getAllChallenges = async (req, res, next) => {...};
    req -> Request object that may contain parameters for filtering challenges (not used in this implementation).
    res -> Response object that carries a list of all challenges and a success status.
    next -> The next middleware function in the pipeline.
DESCRIPTION
    This function retrieves all challenges available in the system without any filtering.
    It sends a list of challenges in the response along with a success status.
RETURNS
    None.
*/
/**/
exports.getAllChallenges = async (req, res, next) => {
    try {
        const challenges = await Challenge.find();

        res.status(200).json({
            success: true,
            challenges,
        });
    } catch (error) {
        next(new ErrorHandler(error.message));
    }
};
/* getAllChallenges = async (req, res, next) => {...}; */

/**/
/*
getAChallenge()
NAME
    getAChallenge - Retrieves a specific challenge by its ID.
SYNOPSIS
    getAChallenge = async (req, res, next) => {...};
    req -> Request object containing the challenge ID to retrieve.
    res -> Response object that carries the retrieved challenge and a success status.
    next -> The next middleware function in the pipeline.
DESCRIPTION
    This function retrieves a specific challenge from the database based on its ID.
    If the challenge is found, it is sent in the response along with a success status.
RETURNS
    None.
*/
/**/
exports.getAChallenge = async (req, res, next) => {
    try {
        console.log("getAchallenge");
        const challenge = await Challenge.findById(req.params.challengeId);
        if (!challenge) {
            return next(new ErrorHandler(`Challenge with id ${req.params.challengeId} does not exist`));
        }

        res.status(200).json({
            success: true,
            challenge,
        });
        
    } catch (error) {
        next(new ErrorHandler(error.message));
    }
};
/* getAChallenge = async (req, res, next) => {...}; */

/**/
/*
searchChallenges()
NAME
    searchChallenges - Searches for challenges by title and tags.
SYNOPSIS
    searchChallenges = async (req, res, next) => {...};
    req -> Request object containing the search keyword and tags.
    res -> Response object that carries the retrieved challenges and a success status.
    next -> The next middleware function in the pipeline.
DESCRIPTION
    This function searches for challenges in the database based on a keyword and tags.
    It constructs a query that matches the keyword and tags and retrieves matching challenges.
RETURNS
    None.
*/
/**/
exports.searchChallenges = async (req, res, next) => {
    try {
        console.log("Here in search challenges");
        const keyword = req.body.keyword ? req.body.keyword : "";
        const tags = req.body.tags ? req.body.tags : [""];
        console.log(tags);

        const query = {
            $and: [
                {
                    $or: [
                        { title: { $regex: keyword, $options: "i" } },
                        { challenge: { $regex: keyword, $options: "i" } },
                    ],
                },
                {
                    tags: {
                        $in: tags.map((tag) => new RegExp(tag, "i")),
                    },
                },
            ],
        };

        const challenges = await Challenge.find(query).sort("-upvotes");

        res.status(200).json({
            success: true,
            challenges,
        });
        
    } catch (error) {
        next(new ErrorHandler(error.message));
    }
};
/* searchChallenges = async (req, res, next) => {...}; */


/**/
/*
getAllFollowedChallenges()
NAME
    getAllFollowedChallenges - Retrieves challenges followed by the user.
SYNOPSIS
    getAllFollowedChallenges = async (req, res, next) => {...};
    req -> Request object containing the user's information and search criteria.
    res -> Response object that carries the retrieved challenges and a success status.
    next -> The next middleware function in the pipeline.
DESCRIPTION
    This function retrieves challenges followed by the user based on a keyword and tags.
    It constructs a query that matches the keyword and tags and retrieves matching challenges
    created by users followed by the current user.
RETURNS
    None.
*/
/**/
exports.getAllFollowedChallenges = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return next(new ErrorHandler(`User does not exist!`));
        }

        const keyword = req.body.keyword ? req.body.keyword : "";
        const tags = req.body.tags ? req.body.tags : [""];
        console.log(tags);

        const query = {
            $and: [
                {
                    $or: [
                        { title: { $regex: keyword, $options: "i" } },
                        { challenge: { $regex: keyword, $options: "i" } },
                    ],
                },
                {
                    tags: {
                        $in: tags.map((tag) => new RegExp(tag, "i")),
                    },
                },
            ],
        };

        const followingUsers = user.following;
        const challenges = [];

        for (let i = 0; i < followingUsers.length; i++) {
            let followingUser = await User.findById(followingUsers[i]);
            let challengesUser = await Challenge.find({
                creatorId: followingUser.id,
                ...query,
            }).sort("-upvotes");
            challenges.push(...challengesUser);
        }

        res.status(200).json({
            success: true,
            challenges,
        });
        
    } catch (error) {
        next(new ErrorHandler(error.message));
    }
};
/* getAllFollowedChallenges = async (req, res, next) => {...}; */


/**/
/*
getChallengesCreatedByMe()
NAME
    getChallengesCreatedByMe - Retrieves challenges created by the user.
SYNOPSIS
    getChallengesCreatedByMe = async (req, res, next) => {...};
    req -> Request object containing the user's information and search criteria.
    res -> Response object that carries the retrieved challenges and a success status.
    next -> The next middleware function in the pipeline.
DESCRIPTION
    This function retrieves challenges created by the user based on a keyword and tags.
    It constructs a query that matches the keyword and tags and retrieves matching challenges
    created by the user.
RETURNS
    None.
*/
/**/
exports.getChallengesCreatedByMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        const keyword = req.body.keyword ? req.body.keyword : "";
        const tags = req.body.tags ? req.body.tags : [""];
        console.log(tags);

        const query = {
            $and: [
                {
                    $or: [
                        { title: { $regex: keyword, $options: "i" } },
                        { challenge: { $regex: keyword, $options: "i" } },
                    ],
                },
                {
                    tags: {
                        $in: tags.map((tag) => new RegExp(tag, "i")),
                    },
                },
            ],
        };

        const challenges = await Challenge.find({
            creatorId: user.id,
            ...query,
        }).sort("-upvotes");

        res.status(200).json({
            success: true,
            challenges,
            message: "Challenges created by the user",
        });
        
    } catch (error) {
        next(new ErrorHandler(error.message));
    }
};
/* getChallengesCreatedByMe = async (req, res, next) => {...}; */

/**/
/*
getAllChallengesByAUser()
NAME
    getAllChallengesByAUser - Retrieves all challenges associated with a user.
SYNOPSIS
    getAllChallengesByAUser = async (req, res, next) => {...};
    req -> Request object containing the user's ID.
    res -> Response object that carries the retrieved challenges and a success status.
    next -> The next middleware function in the pipeline.
DESCRIPTION
    This function retrieves all challenges that a user is associated with, including ongoing,
    completed, and failed challenges. It constructs an array that combines these challenges
    and sends it in the response.
RETURNS
    None.
*/
/**/
exports.getAllChallengesByAUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return next(new ErrorHandler(`User does not exist`));
        }

        let allChallenges = [];
        
        // Get the ongoing, completed, and failed challenges associated with the user
        allChallenges.push(...user.onGoingChallenges, ...user.failedChallenges, ...user.completedChallenges);

        res.status(200).json({
            success: true,
            allChallenges,
        });

    } catch (error) {
        next(new ErrorHandler(error.message));
    }
};
/* getAllChallengesByAUser = async (req, res, next) => {...}; */


/**/
/*
getMyChallenges()
NAME
    getMyChallenges - Retrieves challenges joined by a user.
SYNOPSIS
    getMyChallenges = async (req, res, next) => {...};
    req -> Request object containing the user's ID.
    res -> Response object that carries the retrieved challenges and a success status.
    next -> The next middleware function in the pipeline.
DESCRIPTION
    This function retrieves challenges that a user has joined, including ongoing, completed,
    and failed challenges. It constructs an array that combines these challenges and sends it in the response.
RETURNS
    None.
*/
/**/
exports.getMyChallenges = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return next(new ErrorHandler(`User does not exist`));
        }

        let allChallenges = [];
        
        // Get the ongoing, completed, and failed challenges joined by the user
        allChallenges.push(...user.onGoingChallenges, ...user.failedChallenges, ...user.completedChallenges);

        res.status(200).json({
            success: true,
            allChallenges,
        });

    } catch (error) {
        next(new ErrorHandler(error.message));
    }
};
/* getMyChallenges = async (req, res, next) => {...}; */


/**/
/*
getAllUpvotesForAChallenge()
NAME
    getAllUpvotesForAChallenge - Retrieves the names of all users who upvoted a challenge.
SYNOPSIS
    getAllUpvotesForAChallenge = async (req, res, next) => {...};
    req -> Request object containing the user's ID and the challenge ID.
    res -> Response object that carries the upvoters' names, upvotes, and a success status.
    next -> The next middleware function in the pipeline.
DESCRIPTION
    This function retrieves the names of all users who upvoted a specific challenge. It iterates through
    the challenge's upvotes, fetches the upvoter's name, and constructs an array of upvoters' names.
RETURNS
    None.
*/
/**/
exports.getAllUpvotesForAChallenge = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        const challenge = await Challenge.findById(req.params.challengeId);
        if (!challenge) {
            return next(new ErrorHandler(`Challenge with id ${req.params.id} does not exist`));
        }

        let upvoters = [];

        for (let i = 0; i < challenge.upvotes.length; i++) {
            let upvoter = await User.findById(challenge.upvotes[i]);
            // Fetch the name and id for each upvoter
            upvoters.push(upvoter.name);
        }

        res.status(200).json({
            success: true,
            upvotes: challenge.upvotes,
            upvoters,
        });

    } catch (error) {
        next(new ErrorHandler(error.message));
    }
};
/* getAllUpvotesForAChallenge = async (req, res, next) => {...}; */
