const User = require("../models/userModel.js");
const ErrorHandler = require("../utils/errorHandler.js");
const sendToken = require("../utils/sendToken.js");
const sendEmail = require("../utils/sendEmail.js");
const cloudinary = require("cloudinary")
const Message = require("../models/messagesModel.js")
const fs = require("fs");
/**/
/*
registerUser()
NAME
    registerUser - Register a new user.
SYNOPSIS
    registerUser = async (req, res, next) => {...};
    req -> Request object containing user registration data.
    res -> Response object indicating the success of user registration.
    next -> The next middleware function in the pipeline.
DESCRIPTION
    This function registers a new user by validating the user data, checking for duplicate email addresses,
    and creating a new user record in the database.
RETURNS
    None.
*/
/**/
exports.registerUser = async (req, res, next) => {
    try {
      console.log("EREE");
      // Get the required user information
      const { name, email, password, lat, long, avatar } = req.body;
  
      // Check for duplicate email
      const existingUser = await User.find({ email });
      if (existingUser.length !== 0) {
        return next(new ErrorHandler("Duplicate Email", 401));
      }
  
      // Upload user's avatar image to Cloudinary
      const result = await cloudinary.uploader.upload('data:image/jpeg;base64,' + avatar, {
        folder: 'RegisterImage',
      });
  
      console.log("EREE 2");
  
      // Create user
      const user = await User.create({
        name,
        email,
        password,
        location: {
          type: "Point",
          coordinates: [long, lat],
        },
        avatar: {
          public_id: result.public_id,
          url: result.secure_url,
        },
      });
  
      console.log("EREE 3");
  
      // Send the token and respond with success
      sendToken(user, 201, res);
    } catch (error) {
      console.log(error);
      next(new ErrorHandler(error.message));
    }
  };
  /* registerUser = async (req, res, next) => {...}; */
  

/**/
/*
sendActivateOTP()
NAME
    sendActivateOTP - Send an activation OTP to the user's email.
SYNOPSIS
    sendActivateOTP = async (req, res, next) => {...};
    req -> Request object containing the user's email for OTP sending.
    res -> Response object indicating the success of OTP sending.
    next -> The next middleware function in the pipeline.
DESCRIPTION
    This function sends an activation OTP (One-Time Password) to the user's email.
    It checks if the user is not already activated, generates the OTP, and sends it via email.
RETURNS
    None.
*/
/**/
exports.sendActivateOTP = async (req, res, next) => {
    try {
      console.log("Here in send activate");
  
      // Find the user by their email
      const user = await User.findOne({ email: req.user.email });
      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }
  
      // Check if the user is not already activated
      if (!user.isActivated) {
        // Generate an activation OTP
        const activateOTP = user.getActivateOTP();
        await user.save({ validateBeforeSave: false });
  
        // Compose the OTP message
        const message = `Your Activation OTP is ${activateOTP}\n\n`;
  
        try {
          // Send the OTP email to the user
          await sendEmail({
            email: user.email,
            subject: "Account Activation OTP",
            message,
          });
  
          res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`,
          });
        } catch (error) {
          // Set the activateOTP and expiry to undefined
          user.activateOTP = undefined;
          user.activateExpire = undefined;
          await user.save({ validateBeforeSave: false });
  
          return next(new ErrorHandler(error.message, 500));
        }
      } else {
        res.status(200).json({
          success: true, // The operation did not fail; the user is already activated.
          message: "User is already activated.",
        });
      }
    } catch (error) {
      next(new ErrorHandler(error.message));
    }
  };
  /* sendActivateOTP = async (req, res, next) => {...}; */
  
/**/
/*
activateAccount()
NAME
    activateAccount - Activate a user's account using an activation OTP.
SYNOPSIS
    activateAccount = async (req, res, next) => {...};
    req -> Request object containing the user's activation OTP.
    res -> Response object indicating the success of the account activation.
    next -> The next middleware function in the pipeline.
DESCRIPTION
    This function activates a user's account by verifying the provided activation OTP.
    It checks if the OTP is valid, not expired, and matches the stored OTP in the database.
RETURNS
    None.
*/
/**/
exports.activateAccount = async (req, res, next) => {
    try {
      console.log("Here in activateAccount");
      const activateOTP = req.body.activateOTP;
  
      // Ensure the OTP has not expired and matches the user's stored OTP
      const user = await User.findOne({
        id: req.user.id,
        activateOTP,
        activateExpire: { $gt: Date.now() },
      });
  
      if (!user) {
        return next(new ErrorHandler("Activation token is invalid or has expired", 400));
      }
  
      // Activate the user's account
      user.isActivated = true;
      user.activateOTP = undefined;
      user.activateExpire = undefined;
      await user.save();
  
      res.status(200).json({
        success: true,
        message: "Account activated!",
      });
    } catch (error) {
      next(new ErrorHandler(error.message));
    }
  };
  /* activateAccount = async (req, res, next) => {...}; */
  
  
  /**/
  /*
  loginUser()
  NAME
      loginUser - Authenticate and log in a user.
  SYNOPSIS
      loginUser = async (req, res, next) => {...};
      req -> Request object containing user's email and password for authentication.
      res -> Response object indicating the success of user authentication.
      next -> The next middleware function in the pipeline.
  DESCRIPTION
      This function authenticates a user's login by verifying the provided email and password.
      It checks if the user exists, compares the password, and sends an authentication token upon success.
  RETURNS
      None.
  */
  /**/
  exports.loginUser = async (req, res, next) => {
    try {
      console.log("LOGIN");
  
      const { email, password } = req.body;
      if (!email || !password) {
        return next(new ErrorHandler("Please Enter Email & Password", 400));
      }
      const existingUser = await User.findOne({ email }).select("+password");
  
      if (!existingUser) {
        return next(new ErrorHandler("User does not exist", 404));
      }
  
      const isPasswordCorrect = await existingUser.comparePassword(password);
  
      if (!isPasswordCorrect) {
        return next(new ErrorHandler("Invalid credentials", 401));
      }
      console.log("HERE IN LOGIN");
  
      sendToken(existingUser, 200, res);
    } catch (error) {
      next(error);
    }
  };
  /* loginUser = async (req, res, next) => {...}; */
  
  
  /**/
  /*
  logoutUser()
  NAME
      logoutUser - Log out a user by clearing the authentication token.
  SYNOPSIS
      logoutUser = async (req, res, next) => {...};
      req -> Request object (user authentication required).
      res -> Response object indicating the success of user logout.
      next -> The next middleware function in the pipeline.
  DESCRIPTION
      This function logs out a user by clearing the authentication token cookie.
      After logging out, the user's token becomes null, and they are effectively logged out.
  RETURNS
      None.
  */
  /**/
  exports.logoutUser = async (req, res, next) => {
    try {
      // Set the authentication token as null to log the user out
      res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
      });
      res.status(200).json({
        success: true,
        message: "Logged Out",
      });
    } catch (error) {
      next(new ErrorHandler(error.message));
    }
  };
  /* logoutUser = async (req, res, next) => {...}; */
  


/**/
/*
changePassword()
NAME
    changePassword - Change a user's password.
SYNOPSIS
    changePassword = async (req, res, next) => {...};
    req -> Request object containing user's previous and new passwords.
    res -> Response object indicating the success of password change.
    next -> The next middleware function in the pipeline.
DESCRIPTION
    This function allows a user to change their password. It verifies the user's previous password,
    updates it to the new password, and re-authenticates the user.
RETURNS
    None.
*/
/**/
exports.changePassword = async (req, res, next) => {
    try {
      console.log("Here in change password");
      const user = await User.findById(req.user.id).select("+password");
      if (!user) return next(new ErrorHandler("User does not exist", 404));
  
      const isPasswordMatched = await user.comparePassword(req.body.prevpassword);
      if (!isPasswordMatched) {
        return next(new ErrorHandler("Password is Incorrect!", 400));
      }
      user.password = req.body.newpassword;
      await user.save();
      sendToken(user, 200, res);
    } catch (error) {
      next(new ErrorHandler(error.message));
    }
  };
  /* changePassword = async (req, res, next) => {...}; */
  
  
  /**/
  /*
  getAllUsers()
  NAME
      getAllUsers - Get a list of all users (admin access required).
  SYNOPSIS
      getAllUsers = async (req, res, next) => {...};
      req -> Request object (admin access required).
      res -> Response object containing a list of all users.
      next -> The next middleware function in the pipeline.
  DESCRIPTION
      This function retrieves a list of all users in the system. It is intended for admin use
      and requires admin access.
  RETURNS
      None.
  */
  /**/
  exports.getAllUsers = async (req, res, next) => {
    try {
      const users = await User.find();
  
      res.status(200).json({
        success: true,
        users,
      });
    } catch (error) {
      next(new ErrorHandler(error.message));
    }
  };
  /* getAllUsers = async (req, res, next) => {...}; */
  
  
  /**/
  /*
  getAllUsersRegex()
  NAME
      getAllUsersRegex - Get a list of users whose name matches a regular expression.
  SYNOPSIS
      getAllUsersRegex = async (req, res, next) => {...};
      req -> Request object containing a regular expression pattern for user names.
      res -> Response object containing a list of users matching the pattern.
      next -> The next middleware function in the pipeline.
  DESCRIPTION
      This function retrieves a list of users whose names match the provided regular expression pattern.
      It performs a case-insensitive search for user names in the database.
  RETURNS
      None.
  */
  /**/
  exports.getAllUsersRegex = async (req, res, next) => {
    try {
      console.log(req.body);
      const users = await User.find({
        name: { $regex: req.body.name, $options: "i" },
      });
      res.status(200).json({
        success: true,
        users,
      });
    } catch (error) {
      next(new ErrorHandler(error.message));
    }
  };
  /* getAllUsersRegex = async (req, res, next) => {...}; */
  
  
  /**/
  /*
  getAUser()
  NAME
      getAUser - Get information about a single user.
  SYNOPSIS
      getAUser = async (req, res, next) => {...};
      req -> Request object containing the user's ID.
      res -> Response object containing information about the user.
      next -> The next middleware function in the pipeline.
  DESCRIPTION
      This function retrieves information about a single user based on their ID.
      It checks if the user exists and responds with the user's information if found.
  RETURNS
      None.
  */
  /**/
  exports.getAUser = async (req, res, next) => {
    try {
      console.log(req.params);
      const user = await User.findById(req.params.id);
      if (!user) {
        return next(new ErrorHandler(`User with id : ${req.params.id} does not exist`));
      }
      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      next(new ErrorHandler(error.message));
    }
  };
  /* getAUser = async (req, res, next) => {...}; */
  
/**/
/*
getMyProfile()
NAME
    getMyProfile - Get the profile information of the authenticated user.
SYNOPSIS
    getMyProfile = async (req, res) => {...};
    req -> Request object containing the user's ID (from authentication token).
    res -> Response object containing the user's profile information.
DESCRIPTION
    This function retrieves the profile information of the authenticated user based on their ID.
    It responds with the user's profile data.
RETURNS
    None.
*/
/**/
exports.getMyProfile = async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
  
      if (!user) {
        return next(new ErrorHandler(`User with id : ${req.params.id} does not exist`));
      }
  
      res.status(200).json({
        success: true,
        user,
        message: "Welcome back",
      });
    } catch (error) {
      next(new ErrorHandler(error.message));
    }
  };
  /* getMyProfile = async (req, res) => {...}; */
  
  /**/
  /*
  updateUser()
  NAME
      updateUser - Update the profile information of the authenticated user.
  SYNOPSIS
      updateUser = async (req, res, next) => {...};
      req -> Request object containing the user's updated data.
      res -> Response object indicating the success of the update.
      next -> The next middleware function in the pipeline.
  DESCRIPTION
      This function allows the authenticated user to update their profile information,
      including their name and avatar. If avatarUpdateBool is true, it uploads a new avatar image.
  RETURNS
      None.
  */
  /**/
  exports.updateUser = async (req, res, next) => {
    try {
      const { name, avatar, avatarUpdateBool, base64Image } = req.body;
  
      let result;
      let newAvatar;
      let newData;
      if (avatarUpdateBool) {
        console.log(base64Image);
        result = await cloudinary.uploader.upload('data:image/jpeg;base64,' + base64Image, {
          folder: 'RegisterImage',
        });
  
        console.log(result);
  
        newAvatar = {
          public_id: result.public_id,
          url: result.secure_url,
        };
        newData = { name, avatar: newAvatar };
      } else {
        newData = { name };
      }
  
      const user = await User.findByIdAndUpdate(req.user.id, newData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      });
  
      res.status(200).json({
        success: true,
        message: `User updated`,
        user,
      });
    } catch (error) {
      next(new ErrorHandler(error.message));
    }
  };
  /* updateUser = async (req, res, next) => {...}; */
  
  /**/
  /*
  deleteMyAccount()
  NAME
      deleteMyAccount - Delete the authenticated user's account.
  SYNOPSIS
      deleteMyAccount = async (req, res, next) => {...};
      req -> Request object containing the user's ID (from authentication token).
      res -> Response object indicating the success of the account deletion.
      next -> The next middleware function in the pipeline.
  DESCRIPTION
      This function allows the authenticated user to delete their own account. It removes the user's record
      from the database.
  RETURNS
      None.
  */
  /**/
  exports.deleteMyAccount = async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return next(new ErrorHandler(`User does not exist with id: ${req.user.id}`));
      }
      // TODO: We will remove cloudinary
  
      await user.remove();
      res.status(200).json({
        success: true,
        message: "Account deleted successfully!",
      });
    } catch (error) {
      next(new ErrorHandler(error.message));
    }
  };
/* deleteMyAccount = async (req, res, next) => {...}; */
  
/**/
/*
sendResetPasswordOTP()
NAME
    sendResetPasswordOTP - Send a reset password OTP (One-Time Password) to the user's email.
SYNOPSIS
    sendResetPasswordOTP = async (req, res, next) => {...};
    req -> Request object containing the user's email for OTP sending.
    res -> Response object indicating the success of OTP sending.
    next -> The next middleware function in the pipeline.
DESCRIPTION
    This function sends a reset password OTP to the user's email. It checks if the user exists,
    generates the OTP, and sends it via email.
RETURNS
    None.
*/
/**/
exports.sendResetPasswordOTP = async (req, res, next) => {
    try {
      console.log("HJERE");
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }
  
      const resetOTP = user.getResetPasswordOTP();
      await user.save({ validateBeforeSave: false });
      const message = `Your Reset Password OTP is ${resetOTP}\n\n`;
      try {
        await sendEmail({
          email: user.email,
          subject: "Reset Password OTP",
          message,
        });
  
        res.status(200).json({
          success: true,
          message: `Email sent to ${user.email} successfully`,
        });
      } catch (error) {
        // Set the resetOTP and expiry to undefined
        user.resetPasswordOTP = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new ErrorHandler(error.message, 500));
      }
    } catch (error) {
      next(new ErrorHandler(error.message));
    }
  };
  /* sendResetPasswordOTP = async (req, res, next) => {...};*/
  
  /**/
  /*
  resetPassword()
  NAME
      resetPassword - Reset the user's password using a valid OTP.
  SYNOPSIS
      resetPassword = async (req, res, next) => {...};
      req -> Request object containing the user's email, reset password OTP, and new password.
      res -> Response object indicating the success of password reset.
      next -> The next middleware function in the pipeline.
  DESCRIPTION
      This function allows the user to reset their password by validating the OTP and updating their password.
      It checks if the OTP is valid and not expired and updates the password accordingly.
  RETURNS
      None.
  */
  /**/
  exports.resetPassword = async (req, res, next) => {
    try {
      console.log("here in reset pw");
      console.log(req.body);
      const resetPasswordOTP = req.body.resetPasswordOTP;
  
      // We also need to make sure that the OTP has not expired and
      // check if the resetPasswordOTP stored in the user's database matches the resetPasswordOTP from the request
  
      const user = await User.findOne({
        email: req.body.email,
        resetPasswordOTP,
        resetPasswordExpire: { $gt: Date.now() },
      });
  
      if (!user) {
        return next(new ErrorHandler("Reset OTP is invalid or has been expired", 400));
      }
      user.resetPasswordOTP = undefined;
      user.resetPasswordExpire = undefined;
  
      user.password = req.body.newpassword;
  
      await user.save();
      res.status(200).json({
        success: true,
        message: "Password Reset!",
        user,
      });
    } catch (error) {
      next(new ErrorHandler(error.message));
    }
  };
  /*resetPassword = async (req, res, next) => {...}; */
  
  /**/
  /*
  sendFollowRequest()
  NAME
      sendFollowRequest - Send a follow request to another user.
  SYNOPSIS
      sendFollowRequest = async (req, res, next) => {...};
      req -> Request object containing the user's ID (from authentication token) and the target user's ID.
      res -> Response object indicating the success of the follow request.
      next -> The next middleware function in the pipeline.
  DESCRIPTION
      This function allows the authenticated user to send a follow request to another user. It checks if
      the user is already following the target user or has sent a follow request previously.
  RETURNS
      None.
  */
  /**/
  exports.sendFollowRequest = async (req, res, next) => {
    try {
      const user2 = await User.findById(req.params.user2id);
  
      // Check if user1 follows user2
      // If yes, then send an error message
      if (user2.followers.includes(req.user.id)) {
        res.status(200).json({
          success: true,
          message: `You already follow ${user2.name}`,
          user: user2,
        });
      }
      // If no
      // Then check if user1 has already sent the follow request
      else {
        if (user2.followRequests.includes(req.user.id)) {
          res.status(200).json({
            success: true,
            message: `You already sent a follow request to ${user2.name}`,
            user: user2,
          });
        } else {
          user2.followRequests.push(req.user.id);
          await user2.save();
          res.status(200).json({
            success: true,
            message: `You sent a follow request to ${user2.name}`,
            user: user2,
          });
        }
      }
    } catch (error) {
      next(new ErrorHandler(error.message));
    }
  };
  /*sendFollowRequest = async (req, res, next) => {...}; */
  

/**/
/*
acceptFollowRequest()
NAME
    acceptFollowRequest - Accept a follow request from another user.
SYNOPSIS
    acceptFollowRequest = async (req, res, next) => {...};
    req -> Request object containing the user's ID (from authentication token) and the target user's ID.
    res -> Response object indicating the success of the follow request acceptance.
    next -> The next middleware function in the pipeline.
DESCRIPTION
    This function allows the authenticated user to accept a follow request from another user. It checks if
    the user is already being followed by the target user and, if not, accepts the request.
RETURNS
    None.
*/
/**/
exports.acceptFollowRequest = async (req, res, next) => {
    try {
      const user2 = await User.findById(req.params.user2id);
      const user1 = await User.findById(req.user.id);
      // Check if user2 follows user1
      if (user1.followers.includes(req.params.user2id)) {
        res.status(200).json({
          success: true,
          message: `${user2.name} already follows you`,
        });
      } else {
        if (user1.followRequests.includes(req.params.user2id)) {
          user1.followers.push(req.params.user2id);
          user2.following.push(req.user.id);
          // Delete the follow request
          user1.followRequests = user1.followRequests.filter((id, ind) => {
            return id.toString() !== req.params.user2id;
          });
  
          await user1.save();
          await user2.save();
  
          res.status(200).json({
            success: true,
            message: `${user2.name} now follows you`,
          });
        } else {
          res.status(200).json({
            success: false,
            message: `There is no follow request from ${user2.name}`,
          });
        }
      }
    } catch (error) {
      next(new ErrorHandler(error.message));
    }
  };
  /*acceptFollowRequest = async (req, res, next) => {...}; */
  
  /**/
  /*
  unfollow()
  NAME
      unfollow - Unfollow another user.
  SYNOPSIS
      unfollow = async (req, res, next) => {...};
      req -> Request object containing the user's ID (from authentication token) and the target user's ID.
      res -> Response object indicating the success of unfollowing the user.
      next -> The next middleware function in the pipeline.
  DESCRIPTION
      This function allows the authenticated user to unfollow another user. It removes the target user from
      the user's following list and removes the user from the target user's followers list.
  RETURNS
      None.
  */
  /**/
  exports.unfollow = async (req, res, next) => {
    try {
      // You are user1
      // You want to unfollow user2
      // Remove user2 from user1's following list
      // Remove user1 from user2's followers list
      const user1 = await User.findById(req.user.id);
      const user2 = await User.findById(req.params.user2id);
  
      // Check if user1 follows user2
      if (user1.following.includes(req.params.user2id)) {
        // Remove
        user1.following = user1.following.filter((id, ind) => {
          return id.toString() !== req.params.user2id;
        });
        user2.followers = user2.followers.filter((id, ind) => {
          return id.toString() !== req.user.id;
        });
  
        await user1.save();
        await user2.save();
        res.status(200).json({
          success: true,
          message: `You unfollowed ${user2.name}`,
          user: user2,
        });
      } else {
        res.status(200).json({
          success: true,
          message: `You don't follow ${user2.name}`,
          user: user2,
        });
      }
    } catch (error) {
      next(new ErrorHandler(error.message));
    }
  };
  /*unfollow = async (req, res, next) => {...}; */
  
  /**/
  /*
  removeFollowing()
  NAME
      removeFollowing - Remove a user from your followers list.
  SYNOPSIS
      removeFollowing = async (req, res, next) => {...};
      req -> Request object containing the user's ID (from authentication token) and the target user's ID.
      res -> Response object indicating the success of removing the user from your followers list.
      next -> The next middleware function in the pipeline.
  DESCRIPTION
      This function allows the authenticated user to remove another user from their followers list.
      It automatically updates the target user's following list.
  RETURNS
      None.
  */
  /**/
  exports.removeFollowing = async (req, res, next) => {
    try {
      // User1 removes user2 from their followers list
      // User2's following list automatically gets updated
      const user1 = await User.findById(req.user.id);
      const user2 = await User.findById(req.params.user2id);
  
      if (user1.followers.includes(req.params.user2id)) {
        user1.followers = user1.followers.filter((id, ind) => {
          return id.toString() !== req.params.user2id;
        });
        user2.following = user2.following.filter((id, ind) => {
          return id.toString() !== req.user.id;
        });
        await user1.save();
        await user2.save();
        res.status(200).json({
          success: true,
          message: `You removed ${user2.name} from your followers`,
        });
      } else {
        res.status(200).json({
          success: true,
          message: `${user2.name} does not follow you`,
        });
      }
    } catch (error) {
      next(new ErrorHandler(error.message));
    }
  };

  /* removeFollowing - Remove a user from your followers list. */
  

/**/
/*
getAllFollowRequests()
NAME
    getAllFollowRequests - Get all follow requests received by the authenticated user.
SYNOPSIS
    getAllFollowRequests = async (req, res, next) => {...};
    req -> Request object containing the user's ID (from authentication token).
    res -> Response object containing the list of follow requests.
    next -> The next middleware function in the pipeline.
DESCRIPTION
    This function retrieves all follow requests received by the authenticated user and responds with the list
    of users who sent these follow requests.
RETURNS
    None.
*/
/**/
exports.getAllFollowRequests = async (req, res, next) => {
    try {
      console.log("here in get all follow requests");
      const user = await User.findById(req.user.id).populate("followRequests");
      if (!user) {
        return next(new ErrorHandler("User not found", 400));
      }
      const followRequesters = user.followRequests;
      res.status(200).json({
        success: true,
        users: followRequesters,
      });
    } catch (error) {
      next(new ErrorHandler(error.message));
    }
  };
  /*getAllFollowRequests = async (req, res, next) => {...}; */
  
  /**/
  /*
  getMutualFollowers()
  NAME
      getMutualFollowers - Get mutual followers of the authenticated user.
  SYNOPSIS
      getMutualFollowers = async (req, res, next) => {...};
      req -> Request object containing the user's ID (from authentication token) and the search criteria for name.
      res -> Response object containing the list of mutual followers matching the search criteria.
      next -> The next middleware function in the pipeline.
  DESCRIPTION
      This function retrieves the mutual followers of the authenticated user based on the search criteria for names.
      It checks the users who follow the authenticated user and whom the authenticated user follows back.
  RETURNS
      None.
  */
  /**/
  exports.getMutualFollowers = async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id).select("followers following");
  
      // Get the IDs of the users who follow the authenticated user
      const myFollowers = user.followers.map((follower) => follower.toString());
  
      // Get the IDs of the users whom the authenticated user follows
      const myFollowing = user.following.map((following) => following.toString());
  
      // Get the IDs of the users who follow the authenticated user and whom the authenticated user follows back
      const mutualFollowers = myFollowers.filter((followerId) =>
        myFollowing.includes(followerId)
      );
  
      // Retrieve the user objects of the mutual followers
      const mutualFollowersObjects = await User.find({
        _id: { $in: mutualFollowers },
        name: { $regex: req.body.name, $options: "i" },
      }).select("-password");
  
      res.status(200).json({
        success: true,
        count: mutualFollowersObjects.length,
        data: mutualFollowersObjects,
      });
    } catch (err) {
      next(err);
    }
  };
  /*getMutualFollowers = async (req, res, next) => {...}; */
  
  /**/
  /*
  getAllNoMessagedUsers()
  NAME
      getAllNoMessagedUsers - Get all users whom the authenticated user has not conversed with.
  SYNOPSIS
      getAllNoMessagedUsers = async (req, res, next) => {...};
      req -> Request object containing the user's ID (from authentication token).
      res -> Response object containing the list of users the authenticated user has not conversed with.
      next -> The next middleware function in the pipeline.
  DESCRIPTION
      This function retrieves all users whom the authenticated user has not conversed with and responds with the list
      of these users.
  RETURNS
      None.
  */
  /**/
  exports.getAllNoMessagedUsers = async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);
      // Find all the messages sent or received by the user
      const userId = user._id;
      const messages = await Message.find({
        $or: [{ sender: userId }, { recipient: userId }],
      });
  
      // Get the IDs of all the users the user has had messages with
      const usersWithMessages = new Set();
      messages.forEach((message) => {
        if (message.sender.toString() === userId.toString()) {
          usersWithMessages.add(message.recipient.toString());
        } else {
          usersWithMessages.add(message.sender.toString());
        }
      });
  
      // Find all the users except the user and those with whom the user has had messages
      const users = await User.find({
        $and: [
          { _id: { $ne: userId } },
          { _id: { $nin: [...usersWithMessages] } },
        ],
      });
  
      res.status(200).json({
        success: true,
        users,
      });
    } catch (error) {
      next(new ErrorHandler(error.message));
    }
  };
  /*getAllNoMessagedUsers = async (req, res, next) => {...}; */