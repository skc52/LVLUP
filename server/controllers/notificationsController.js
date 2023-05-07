const User = require("../models/userModel.js");
const Notification = require("../models/notificationsModel.js");
const ErrorHandler = require("../utils/errorHandler.js");



// create a notification
exports.createNotification = async(req, res, next) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user){
            return next(new ErrorHandler(`User with id ${req.params.userId} does not exist`));
         }
         
        const notification = await Notification.create(
           { 
            userId:user.id,
            ...req.body
            }
        )

        res.status(200).json({
            success:true,
            notification,
            message:"Notification created successfully!"
        })
    } catch (error) {
        next(new ErrorHandler(error.message));
    }
}

// delete a notification
exports.deleteNotification = async(req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        const notification = await Notification.findById(req.params.notificationId);
        if (!notification){
           return next(new ErrorHandler(`Notification with id ${req.params.notificationId} does not exist`));

        }

        if (notification.userId.toString()!== req.user.id){
            return next(new ErrorHandler(`User not allowed to delete this notification`));
    
        }

        await notification.remove();
        res.status(200).json({
            success:true,
            message:"Notification deleted successfully!"
        })
    } catch (error) {
        next(new ErrorHandler(error.message));
    }
}

// show all notifications for a user
exports.showNotifications = async(req, res, next) => {
    try {
        const user = await User.findById(req.user.id)
        const notifications = await Notification.find({
            userId:user.id
        })

        res.status(200).json({
            success:true,
            notifications
        })
        
    } catch (error) {
        next(new ErrorHandler(error.message));     
    }
}


// seen a notification
exports.seenNotification = async(req, res, next) => {
    try {
        const user = await User.findById(req.user.id)
        const notifications = await Notification.find({
            userId:user.id
        })

        notifications.map((notification, ind)=>{
            notification.seen = true;
            notification.save();
            return notification;
        })

   

        res.status(200).json({
            success:true,
            notifications,
            message:"No unseen notifications"
        })
        
    } catch (error) {
        next(new ErrorHandler(error.message));     
    }
}