const User = require("../models/userModel.js");
const ErrorHandler = require("../utils/errorHandler.js");
const sendToken = require("../utils/sendToken.js");
const sendEmail = require("../utils/sendEmail.js");
const cloudinary = require("cloudinary")
const Message = require("../models/messagesModel.js")
const fs = require("fs");
// Registers a User
exports.registerUser = async(req, res, next)=>{
    try{
        console.log("EREE")
        // get the required user information
        const {name, email, password, lat, long, avatar} = req.body;
        // Check for duplicate email
        const existinguser = await User.find({email});
        if (existinguser.length!=0){
            return  next(new ErrorHandler("Duplicate Email", 401));
        }

        const result = await cloudinary.uploader.upload('data:image/jpeg;base64,' + avatar, {
            folder: 'RegisterImage',
          });

        // const avatar = req.files.avatar.tempFilePath;
       
        console.log("EREE 2")

        // Create user
        const user = await User.create(
            {
                name, email, password, location:{
                    type:"Point", coordinates:[long, lat],
                   
                }   ,
                avatar: {
                    public_id: result.public_id,
                    url: result.secure_url,
                  },       
            }
        );


        console.log("EREE 3" )


        sendToken(user, 201, res);
    } 
    catch(error){
        console.log(error);
        next(new ErrorHandler(error.message));
    }
}

// send activate otp
exports.sendActivateOTP = async(req, res, next) => {
    try {
        console.log("Here in send activate")
        const user = await User.findOne({email:req.user.email});
        if (!user){
            return next(new ErrorHandler("User not found", 404));
        }


        if (!user.isActivated){ 
            const activateOTP = user.getActivateOTP();
            await user.save({validateBeforeSave:false});
            const message = `Your Activation OTP is ${activateOTP}\n\n`
            try {
                await sendEmail({
                    email:user.email,
                    subject : "Account Activation OTP",
                    message
                });
        
                res.status(200).json({
                    success:true,
                    message:`Email sent to ${user.email} successfully`,
                })
            } catch (error) {
                //Set the activateOTP and expiry to undefined
                user.activateOTP = undefined;
                user.activateExpire = undefined;
                await user.save({validateBeforeSave:false});
                return next(new ErrorHandler(error.message, 500));
            }
        }

        else{
            res.status(200).json({
                success:true,//it did not fail to do ... just the user was already activated
                message:"User is already activated."
            })
        }
    } catch (error) {
        next(new ErrorHandler(error.message));
    }
}

// activate account
exports.activateAccount = async(req, res, next) => {
    try {
        console.log("Here in activateAccount")
        const activateOTP = req.body.activateOTP;

        // we also need to make sure that the otp has not expired and
        // check if the activateOTP stored in database of the user matches the activateotp from the request

        const user = await User.findOne({
            id:req.user.id,
            activateOTP,
            activateExpire:{$gt : Date.now()}
        });
    
        if (!user){
            return next (new ErrorHandler("Activation token is invalid or has been expired", 400));
        }

        user.isActivated = true;
        user.activateOTP = undefined;
        user.activateExpire = undefined;
        await user.save();
        res.status(200).json({
            success:true,
            message:"Account activated!",
        })
        
    } catch (error) {
        next(new ErrorHandler(error.message));
    }
}



// Log In User
exports.loginUser = async(req, res, next) => {
    

    try {

        console.log("LOGIN")

        const {email, password} = req.body;
        if(!email || !password){
            return next(new ErrorHandler("Please Enter Email & Password", 400));
        }
        const existingUser = await User.findOne({email}).select("+password");
        
        //remember that in userSchema we defined password to be select equals false
        //here we need to include +password show that we can get its value
        if(!existingUser) return next(new ErrorHandler("User does not exist", 404));

        const isPasswordCorrect = await existingUser.comparePassword(password);

        if (!isPasswordCorrect) return next(new ErrorHandler("Invalid credentials", 401));
        console.log("HERE IN LOGIN ")

        sendToken(existingUser, 200, res)
    } catch (error) {
        next(error);
    }
}

// Log User out
exports.logoutUser = async(req, res, next) =>{
    //set the token as null and you are logged out
    try {
        res.cookie("token", null, {
            expires:new Date(Date.now()),
            httpOnly:true,
        });
        res.status(200).json({
            success:true,
            message:"Logged Out",
        })
    } catch (error) {
        next(new ErrorHandler(error.message));
    }
}


//Change password
exports.changePassword = async(req, res, next)=>{
    try {
        console.log("hre in change passwrd")
        const user = await User.findById(req.user.id).select("+password");
        if(!user) return next(new ErrorHandler("User does not exist", 404)); 

        const isPasswordMatched = await user.comparePassword(req.body.prevpassword);
        if (!isPasswordMatched){
            return next(new ErrorHandler("Password is Incorrect!", 400));
        }
        user.password = req.body.newpassword;
        await user.save();
        sendToken(user, 200, res);
    } catch (error) {   
        next(new ErrorHandler(error.message));
    }
}




//Get all users - admin
exports.getAllUsers = async(req, res, next)=> {
    try {
        const users = await User.find();

        res.status(200).json({
            success:true,
            users,
        })
    } catch (error) {
        next(new ErrorHandler(error.message));
    }
}

//Get all users whose name match with
exports.getAllUsersRegex = async(req, res, next)=> {
    try {
        console.log(req.body);
        const users = await User.find({
            name: { $regex: req.body.name, $options: "i" },
        });
        res.status(200).json({
            success:true,
            users,
        })
    } catch (error) {
        next(new ErrorHandler(error.message));
    }
}



//get a single user
exports.getAUser = async(req, res, next)=>{
    try {
        console.log(req.params)
        const user = await User.findById(req.params.id);
        if (!user){
            return next(new ErrorHandler(`User with id : ${req.params.id} does not exist`));
        }
        res.status(200).json({
            success:true,
            user
        })
    } catch (error) {
        next(new ErrorHandler(error.message));
    }
}

exports.getMyProfile = async (req, res) => {
    try {

      const user = await User.findById(req.user.id);

      if (!user){
        return next(new ErrorHandler(`User with id : ${req.params.id} does not exist`));
    }

    res.status(200).json({
        success:true,
        user,
        message:"Welcome back"
    })
    } catch (error) {
        next(new ErrorHandler(error.message));
    }
  };

//Update the role of a user
exports.updateUser = async(req, res, next) => {
    try {
      
        //we will add cloudinary later

        // if (req.body.password){
        //     return next(new ErrorHandler(`Cannot update password this way`));

        // }

        // if (req.body.long || req.body.lat){
        //     return next(new ErrorHandler(`Cannot update location this way`));
   
        // }
        const {name, avatar, avatarUpdateBool, base64Image} = req.body;
        console.log(avatar)

        let result;
        let newAvatar;
        let newData;
        if (avatarUpdateBool){
            console.log(base64Image)
            result = await cloudinary.uploader.upload('data:image/jpeg;base64,' + base64Image, {
                folder: 'RegisterImage',
              });

              console.log(result)

            newAvatar = {
                public_id: result.public_id,
                url: result.secure_url,
            };  
            newData = {name, avatar:newAvatar}
    
        }
        else{
            newData = {name}

        }

      
       
        
        const user = await User.findByIdAndUpdate(req.user.id, newData,{
            new:true,
            runValidators:true,
            useFindAndModify:false,
        });

    
        res.status(200).json({
            success:true,
            message:`User updated`,
            user
        });
    } catch (error) {
        next(new ErrorHandler(error.message));
    }
}

// delete my Account
exports.deleteMyAccount = async(req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if(!user){
            return next(new ErrorHandler(`User does not exist with id: ${req.user.id}`));
        }
        // TODO: we will remove cloudinary 


        await user.remove();
        res.status(200).json({
            success:true,
            message:"Account deleted successfully!"
        });
    } catch (error) {
        next(new ErrorHandler(error.message));
    }
}

// send reset password otp
exports.sendResetPasswordOTP = async(req, res, next) => {
    try {
        const user = await User.findOne({email:req.body.email});
        if (!user){
            return next(new ErrorHandler("User not found", 404));
        }
        
        const resetOTP = user.getResetPasswordOTP();
        await user.save({validateBeforeSave:false});
        const message = `Your Reset Password OTP is ${resetOTP}\n\n`
        try {
            await sendEmail({
                email:user.email,
                subject : "Reset Password OTP",
                message
            });
    
            res.status(200).json({
                success:true,
                message:`Email sent to ${user.email} successfully`,
            })
        } catch (error) {
            //Set the resetOTP and expiry to undefined
            user.resetPasswordOTP = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({validateBeforeSave:false});
            return next(new ErrorHandler(error.message, 500));
        }
        
    } catch (error) {
        next(new ErrorHandler(error.message));
    }
}


// reset password
exports.resetPassword = async(req, res, next) => {
    try {
        console.log("here in reset pw")
        console.log(req.body)
         const resetPasswordOTP = req.body.resetPasswordOTP;
        
        // we also need to make sure that the otp has not expired and
        // check if the resetPasswordOTP stored in database of the user matches the resetPasswordOTP from the request

        const user = await User.findOne({
            email:req.body.email,
            resetPasswordOTP,
            resetPasswordExpire:{$gt : Date.now()}
        });
    
        if (!user){
            return next (new ErrorHandler("Reset OTP is invalid or has been expired", 400));
        }
        user.resetPasswordOTP = undefined;
        user.resetPasswordExpire = undefined;

        user.password = req.body.newpassword;

        await user.save();
        res.status(200).json({
            success:true,
            message:"Password Reset!",
            user
        })
    } catch (error) {
        next(new ErrorHandler(error.message));
    }
}





exports.sendFollowRequest = async(req, res, next) => {
    try {
        const user2 = await User.findById(req.params.user2id);
        
        //check if user1 follows user2
        //if yes then send an error message
        if (user2.followers.includes(req.user.id)){
            res.status(200).json({
                success:true,
                message:`You already follow ${user2.name}`,
                user:user2
            })
        }
        //if no
        //then check if user1 has already sent the follow request
        else{
            if (user2.followRequests.includes(req.user.id)){
                res.status(200).json({
                    success:true,
                    message:`You already sent follow request to ${user2.name}`,
                    user:user2

                })
            }
            else{
                user2.followRequests.push(req.user.id);
                await user2.save();
                res.status(200).json({
                    success:true,
                    message:`You sent follow request to ${user2.name}`,
                    user:user2
                })
            }
        }
    } catch (error) {
        next(new ErrorHandler(error.message));
    }
}


exports.acceptFollowRequest = async(req, res, next) => {
    try {
        const user2 = await User.findById(req.params.user2id);
        const user1 = await User.findById(req.user.id);
        //check if user2 follows user1
        if (user1.followers.includes(req.params.user2id)){
            res.status(200).json({
                success:true,
                message: `${user2.name} already follows you`
            })
        }

        else{
            if (user1.followRequests.includes(req.params.user2id)){
                user1.followers.push(req.params.user2id);
                user2.following.push(req.user.id);
                //delete the follow request
                user1.followRequests = user1.followRequests.filter((id, ind)=>{
                    return id.toString() !== req.params.user2id;
                })

                await user1.save();
                await user2.save();

                res.status(200).json({
                    success:true,
                    message:`${user2.name} now follows you`,
                })
            }

            else{
                res.status(200).json({
                    success:false,
                    message:`There is no follow request from ${user2.name}`,
                    
                })
            }
        }
    } catch (error) {
        next(new ErrorHandler(error.message));
    }
}


exports.unfollow = async(req, res, next) => {
    try {
        //you are user1
        //you want to unfollow user2
        //remove user2 from user1 following list
        //remove user1 from user2 followers list
        const user1 = await User.findById(req.user.id);
        const user2 = await User.findById(req.params.user2id);

        //check if user1 follows user2
        if (user1.following.includes(req.params.user2id)){
            //remove
            user1.following = user1.following.filter((id, ind)=>{
                return id.toString() !== req.params.user2id;
            })
            user2.followers = user2.followers.filter((id, ind)=>{
                return id.toString() !== req.user.id;
            })

            await user1.save();
            await user2.save();
            res.status(200).json({
                success:true,
                message:`You unfollowed ${user2.name}`,
                user:user2
            })
        }
        else{
            res.status(200).json({
                success:true,
                message:`You don't follow ${user2.name}`,
                user:user2
            })
        }
    } catch (error) {
        next(new ErrorHandler(error.message));
    }
}


exports.removeFollowing = async(req, res, next) => {
    try {
        //user1 removes user2 from his followers list
        //user2 following list automatically gets updated
        const user1 = await User.findById(req.user.id);
        const user2 = await User.findById(req.params.user2id);

        if (user1.followers.includes(req.params.user2id)){
            user1.followers = user1.followers.filter((id, ind)=>{
                return id.toString()!== req.params.user2id;
            })
            user2.following = user2.following.filter((id, ind)=>{
                return id.toString()!== req.user.id;
            })
            await user1.save();
            await user2.save();
            res.status(200).json({
                success:true,
                message:`You removed ${user2.name} from your followers`
            })

        }
        else{
            res.status(200).json({
                success:true,
                message:`${user2.name} does not follow you`
            })
        }

    } catch (error) {
        next(new ErrorHandler(error.message));
    }
}

// get all follow requests
exports.getAllFollowRequests = async(req, res, next) => {
    try {
        console.log("here in get all follow requests")
        const user = await User.findById(req.user.id).populate("followRequests");
        if (!user){
            return next (new ErrorHandler("User not found", 400));
        }
        const followRequesters = user.followRequests;
        res.status(200).json({
            success: true,
            users:followRequesters,
        });
        


    } catch (error) {
        next(new ErrorHandler(error.message));
    }
}



// also has search by name functionality
exports.getMutualFollowers = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('followers following');
    
    // Get the IDs of the users who follow the authenticated user
    const myFollowers = user.followers.map(follower => follower.toString());
    
    // Get the IDs of the users whom the authenticated user follows
    const myFollowing = user.following.map(following => following.toString());
    
    // Get the IDs of the users who follow the authenticated user and whom the authenticated user follows back
    const mutualFollowers = myFollowers.filter(followerId => myFollowing.includes(followerId));
    
    // Retrieve the user objects of the mutual followers
    const mutualFollowersObjects = await User.find({ _id: { $in: mutualFollowers }, name:{
        $regex: req.body.name, $options: "i"
    } }).select('-password');

  
    
    res.status(200).json({ success: true, count: mutualFollowersObjects.length, data: mutualFollowersObjects });
  } catch (err) {
    next(err);
  }
};

// get all users whom I had not conversed with

exports.getAllNoMessagedUsers = async(req, res, next)=>{
    try {
        const user = await User.findById(req.user.id)
        // Find all the messages sent or received by the user
        const userId = user._id;
  const messages = await Message.find({
    $or: [{ sender: userId }, { recipient: userId }]
  });

  // Get the ids of all the users the user has had messages with
  const usersWithMessages = new Set();
  messages.forEach(message => {
    if (message.sender.toString() === userId.toString()) {
        console.log("YVXWIYV")
        console.log(message.recipient.toString());
      usersWithMessages.add(message.recipient.toString());
    } else {
      usersWithMessages.add(message.sender.toString());
    }
  });

//   console.log(usersWithMessages);

  // Find all the users except the user and those with whom the user has had messages
  const users = await User.find({
    $and: [
      { _id: { $ne: userId } },
      { _id: { $nin: [...usersWithMessages] } }
    ]
  });

//   console.log(users);
  res.status(200).json({
    success:true,
    users
  })
        
    } catch (error) {
        next(new ErrorHandler(error.message));

    }
}

// TODO give the number of followers

// TODO give the number of following

// TODO search by name

// TODO get the level

// TODO get the streak

