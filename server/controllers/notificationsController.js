const User = require("../models/userModel.js");
const Notification = require("../models/notificationsModel.js");
const ErrorHandler = require("../utils/errorHandler.js");


/**/
/*
createNotification()
NAME
    createNotification - Create a notification for a user.
SYNOPSIS
    createNotification = async (req, res, next) => {...};
    req -> Request object containing the user's ID (from authentication token) and notification details in the request body.
    res -> Response object containing the created notification.
    next -> The next middleware function in the pipeline.
DESCRIPTION
    This function creates a notification for a specific user and stores it in the database.
RETURNS
    None.
*/
/**/
exports.createNotification = async (req, res, next) => {
    try {
      const user = await User.findById(req.params.userId);
      if (!user) {
        return next(new ErrorHandler(`User with id ${req.params.userId} does not exist`));
      }
  
      const notification = await Notification.create({
        userId: user.id,
        ...req.body,
      });
  
      res.status(200).json({
        success: true,
        notification,
        message: "Notification created successfully!",
      });
    } catch (error) {
      next(new ErrorHandler(error.message));
    }
  };
  /*createNotification = async (req, res, next) => {...}; */
  
  /**/
  /*
  deleteNotification()
  NAME
      deleteNotification - Delete a notification for the authenticated user.
  SYNOPSIS
      deleteNotification = async (req, res, next) => {...};
      req -> Request object containing the authenticated user's ID (from authentication token) and the notification ID to delete.
      res -> Response object indicating the success of notification deletion.
      next -> The next middleware function in the pipeline.
  DESCRIPTION
      This function deletes a notification for the authenticated user based on the provided notification ID.
  RETURNS
      None.
  */
  /**/
  exports.deleteNotification = async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);
      const notification = await Notification.findById(req.params.notificationId);
      if (!notification) {
        return next(new ErrorHandler(`Notification with id ${req.params.notificationId} does not exist`));
      }
  
      if (notification.userId.toString() !== req.user.id) {
        return next(new ErrorHandler(`User not allowed to delete this notification`));
      }
  
      await notification.remove();
      res.status(200).json({
        success: true,
        message: "Notification deleted successfully!",
      });
    } catch (error) {
      next(new ErrorHandler(error.message));
    }
  };
  /*  deleteNotification = async (req, res, next) => {...}; */
  
  /**/
  /*
  showNotifications()
  NAME
      showNotifications - Get all notifications for the authenticated user.
  SYNOPSIS
      showNotifications = async (req, res, next) => {...};
      req -> Request object containing the authenticated user's ID (from authentication token).
      res -> Response object containing the list of notifications for the authenticated user.
      next -> The next middleware function in the pipeline.
  DESCRIPTION
      This function retrieves all notifications for the authenticated user and responds with the list of notifications.
  RETURNS
      None.
  */
  /**/
  exports.showNotifications = async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);
      const notifications = await Notification.find({
        userId: user.id
      });
  
      res.status(200).json({
        success: true,
        notifications
      });
  
    } catch (error) {
      next(new ErrorHandler(error.message));
    }
  };
  /* showNotifications = async (req, res, next) => {...}; */
  
  /**/
  /*
  seenNotification()
  NAME
      seenNotification - Mark all notifications as seen for the authenticated user.
  SYNOPSIS
      seenNotification = async (req, res, next) => {...};
      req -> Request object containing the authenticated user's ID (from authentication token).
      res -> Response object containing the updated list of notifications.
      next -> The next middleware function in the pipeline.
  DESCRIPTION
      This function marks all notifications as seen for the authenticated user and responds with the updated list of notifications.
  RETURNS
      None.
  */
  /**/
  exports.seenNotification = async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);
      const notifications = await Notification.find({
        userId: user.id
      });
  
      notifications.forEach((notification) => {
        notification.seen = true;
        notification.save();
      });
  
      res.status(200).json({
        success: true,
        notifications,
        message: "No unseen notifications"
      });
  
    } catch (error) {
      next(new ErrorHandler(error.message));
    }
  };
  /* seenNotification = async (req, res, next) => {...}; */
  