const Motivation = require("../models/postModel.js");
const User = require("../models/userModel.js");
const ErrorHandler = require("../utils/errorHandler.js");

/**/
/*
createAPost()
NAME
    createAPost - Creates a new post.
SYNOPSIS
    createAPost = async (req, res, next) => {...};
    req -> Request object containing the post creation details.
    res -> Response object indicating the success of the post creation.
    next -> The next middleware function in the pipeline.
DESCRIPTION
    This function allows a user to create a new post. It takes the post content and creator's information,
    creates the post, and returns a success message along with the created post.
RETURNS
    None.
*/
/**/
exports.createAPost = async (req, res, next) => {
    try {
        // Find the user who is creating the post
        const user = await User.findById(req.user.id);
        
        // Create a new post using the provided data
        const post = await Motivation.create({
            creatorId: user.id,
            ...req.body
        });

        res.status(200).json({
            success: true,
            post,
            message: "Post created successfully!"
        });
    } catch (error) {
        next(new ErrorHandler(error.message));
    }
};
/* createAPost = async (req, res, next) => {...}; */

/**/
/*
updateAPost()
NAME
    updateAPost - Updates a post.
SYNOPSIS
    updateAPost = async (req, res, next) => {...};
    req -> Request object containing the post update details.
    res -> Response object indicating the success of the post update.
    next -> The next middleware function in the pipeline.
DESCRIPTION
    This function allows a user to update an existing post. It checks if the post exists and if the user
    is the creator of the post, then updates the post content and returns a success message along with
    the updated post.
RETURNS
    None.
*/
/**/
exports.updateAPost = async (req, res, next) => {
    try {
        console.log("UPDATING THE POST");
        // Find the post by its ID
        let post = await Motivation.findById(req.params.postId);
        if (!post) {
            return next(new ErrorHandler(`Post not found`));
        }

        // Check if the post is created by the requesting user
        if (post.creatorId.toString() !== req.user.id) {
            return next(new ErrorHandler(`User not allowed to update this post`));
        }

        // Update the post with the provided data
        post = await Motivation.findByIdAndUpdate(req.params.postId, req.body, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        });

        res.status(200).json({
            success: true,
            message: `Post updated`,
            post
        });
    } catch (error) {
        next(new ErrorHandler(error.message));
    }
};
/* updateAPost = async (req, res, next) => {...}; */

/**/
/*
deleteAPost()
NAME
    deleteAPost - Deletes a post.
SYNOPSIS
    deleteAPost = async (req, res, next) => {...};
    req -> Request object containing the post ID to be deleted.
    res -> Response object indicating the success of the post deletion.
    next -> The next middleware function in the pipeline.
DESCRIPTION
    This function allows a user to delete an existing post. It checks if the post exists and if the user
    is the creator of the post, then deletes the post and returns a success message.
RETURNS
    None.
*/
/**/
exports.deleteAPost = async (req, res, next) => {
    try {
        const post = await Motivation.findById(req.params.postId);
        if (!post) {
            return next(new ErrorHandler(`Post not found`));
        }

        // Check if the post is created by the requesting user
        if (post.creatorId.toString() !== req.user.id) {
            return next(new ErrorHandler(`User not allowed to delete this post`));
        }

        // TODO: Implement cloudinary removal here (if applicable)

        // Remove the post from the database
        await post.remove();
        res.status(200).json({
            success: true,
            message: "Post deleted successfully!"
        });

    } catch (error) {
        next(new ErrorHandler(error.message));
    }
};
/* deleteAPost = async (req, res, next) => {...}; */

/**/
/*
likeAPost()
NAME
    likeAPost - Like or unlike a post.
SYNOPSIS
    likeAPost = async (req, res, next) => {...};
    req -> Request object containing the post ID to be liked/unliked.
    res -> Response object indicating the success of the like/unlike operation and the updated post.
    next -> The next middleware function in the pipeline.
DESCRIPTION
    This function allows a user to like or unlike an existing post. It checks if the post exists and
    toggles the user's like status for the post. If the user has already liked the post, it unlikes it.
RETURNS
    None.
*/
/**/
exports.likeAPost = async (req, res, next) => {
    try {
        console.log("LIKING A POST")
        const user = await User.findById(req.user.id);
        let post = await Motivation.findById(req.params.postId).populate("creatorId");
        if (!post) {
            return next(new ErrorHandler(`Post not found`));
        }

        // Unlike if already liked
        if (post.likes.includes(user.id)) {
            post.likes = post.likes.filter((like) => {
                return like.toString() !== req.user.id
            });
        }
        // Like if not liked
        else {
            post.likes.push(user.id);
        }

        await post.save();
        res.status(200).json({
            success: true,
            post,
            message: "Like Toggled for this post"
        });

    } catch (error) {
        next(error.message);
    }
};
/* likeAPost = async (req, res, next) => {...}; */


/**/
/*
addComment()
NAME
    addComment - Add a comment to a post.
SYNOPSIS
    addComment = async (req, res, next) => {...};
    req -> Request object containing the post ID and the comment to be added.
    res -> Response object indicating the success of the comment addition and the updated post with comments.
    next -> The next middleware function in the pipeline.
DESCRIPTION
    This function allows a user to add a comment to an existing post. It checks if the post exists and
    adds the comment with user details such as name and avatar to the post's comments array.
RETURNS
    None.
*/
/**/
exports.addComment = async (req, res, next) => {
    try {
        console.log("adding a comment")
        const { postId } = req.params;
        const { comment } = req.body;
        const user = await User.findById(req.user.id);

        const post = await Motivation.findById(postId).populate("creatorId");

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const newComment = {
            postId,
            creatorId: user._id,
            creatorName: user.name,
            creatorAvatar: user.avatar.url,
            comment,
            commentedAt: new Date(),
            edited: false,
        };

        post.comments.push(newComment);

        await post.save();

        console.log(newComment)

        res.status(201).json(
            {
                message: 'Comment added',
                comment: newComment,
                post

            });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
/* addComment = async (req, res, next) => {...}; */



/*
getAllPosts()
NAME
    getAllPosts - Get all posts from "Motivation From around the globe."
SYNOPSIS
    getAllPosts = async (req, res, next) => {...};
    req -> Request object containing no additional parameters.
    res -> Response object containing a list of posts from "Motivation From around the globe."
    next -> The next middleware function in the pipeline.
DESCRIPTION
    This function retrieves all posts from the "Motivation From around the globe" section.
    It queries the database for posts, populates the creator information, and sorts them by creation date.
RETURNS
    None.
*/
exports.getAllPosts = async (req, res, next) => {
    try {
        console.log("HERE IN POSTS CONTROLLER"); // Log a message to indicate the function execution.
        const posts = await Motivation.find().populate("creatorId").sort("-createdAt");

        res.status(200).json({
            success: true, // Indicate the success of the operation.
            posts,
        });
    } catch (error) {
        next(new ErrorHandler(error.message)); // Handle and pass on any errors to the error handler middleware.
    }
};
// getAllPosts = async (req, res, next) => {...};


/*
getAllLikesForAPost()
NAME
    getAllLikesForAPost - Get all likes for a post.
SYNOPSIS
    getAllLikesForAPost = async (req, res, next) => {...};
    req -> Request object containing the post ID for which to retrieve likes.
    res -> Response object containing a list of users who liked the post.
    next -> The next middleware function in the pipeline.
DESCRIPTION
    This function retrieves all the likes for a specific post by querying the database for the post's likes.
RETURNS
    None.
*/
exports.getAllLikesForAPost = async (req, res, next) => {
    try {
        const post = await Motivation.findById(req.params.postId);

        if (!post) {
            return next(new ErrorHandler(`Post not found`));
        }

        const likes = post.likes;

        res.status(200).json({
            success: true,
            likes,
        });
    } catch (error) {
        next(new ErrorHandler(error.message));
    }
};
// getAllLikesForAPost = async (req, res, next) => {...};


/*
getAPost()
NAME
    getAPost - Get a specific post by ID.
SYNOPSIS
    getAPost = async (req, res, next) => {...};
    req -> Request object containing the post ID to retrieve.
    res -> Response object containing the retrieved post or an error message if not found.
    next -> The next middleware function in the pipeline.
DESCRIPTION
    This function retrieves a specific post by its ID. It checks if the post exists and returns it in the response.
RETURNS
    None.
*/
exports.getAPost = async (req, res, next) => {
    try {
        const post = await Motivation.findById(req.params.postId);
        if (!post) {
            return next(new ErrorHandler(`Post not found`));
        }
        res.status(200).json({
            success: true, // Indicate the success of the operation.
            post,
        });
    } catch (error) {
        next(new ErrorHandler(error.message)); // Handle and pass on any errors to the error handler middleware.
    }
};
// getAPost = async (req, res, next) => {...};



exports.getAllFollowedPosts = async(req, res, next)=>{
    try{
        const user = await User.findById(req.user.id);
        const posts = await Motivation.find();

        //filter posts based on user's following list
        const followedPosts = posts.filter((post, id)=>{
            return user.following.includes(post.creatorId);
        })

        res.status(200).json({
            success:true,
            followedPosts
        })

    } 
    catch(error){
        next(new ErrorHandler(error.message));
    }
}


/*
getAllFollowedPosts()
NAME
    getAllFollowedPosts - Get posts followed by the current user.
SYNOPSIS
    getAllFollowedPosts = async (req, res, next) => {...};
    req -> Request object containing the current user's ID.
    res -> Response object containing a list of posts followed by the user.
    next -> The next middleware function in the pipeline.
DESCRIPTION
    This function retrieves posts that are followed by the current user. It fetches the user's following list
    and filters posts based on whether the creator of each post is in the following list.
RETURNS
    None.
*/
exports.getAllFollowedPosts = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        const posts = await Motivation.find();

        // Filter posts based on user's following list
        const followedPosts = posts.filter((post, id) => {
            return user.following.includes(post.creatorId);
        });

        res.status(200).json({
            success: true, // Indicate the success of the operation.
            followedPosts,
        });
    } catch (error) {
        next(new ErrorHandler(error.message)); // Handle and pass on any errors to the error handler middleware.
    }
};
// getAllFollowedPosts = async (req, res, next) => {...};


/*
getUserPosts()
NAME
    getUserPosts - Get posts created by a specific user.
SYNOPSIS
    getUserPosts = async (req, res, next) => {...};
    req -> Request object containing the user's ID.
    res -> Response object containing a list of posts created by the user.
    next -> The next middleware function in the pipeline.
DESCRIPTION
    This function retrieves posts created by a specific user based on the provided user ID.
    It queries the database for posts created by the user, populates creator information, and sorts them by creation date.
RETURNS
    None.
*/
exports.getUserPosts = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);

        // Retrieve posts created by the user
        const posts = await Motivation.find({
            creatorId: user.id
        }).populate("creatorId").sort("-createdAt");

        res.status(200).json({
            success: true, // Indicate the success of the operation.
            posts,
        });
    } catch (error) {
        next(new ErrorHandler(error.message)); // Handle and pass on any errors to the error handler middleware.
    }
};
// getUserPosts = async (req, res, next) => {...};





/*
deleteAllPosts()
NAME
    deleteAllPosts - Delete all posts in the database.
SYNOPSIS
    deleteAllPosts = async (req, res, next) => {...};
    req -> Request object containing no additional parameters.
    res -> Response object indicating the success of the operation.
    next -> The next middleware function in the pipeline.
DESCRIPTION
    This function allows an administrator to delete all posts in the database.
    It uses the `deleteMany` method to remove all documents from the "Motivation" collection.
RETURNS
    None.
*/
exports.deleteAllPosts = async (req, res, next) => {
    try {
      await Motivation.deleteMany({}); // Delete all posts in the "Motivation" collection.
      res.status(200).json({ success: true, message: 'All posts have been deleted.' });
    } catch (err) {
      next(err); // Handle and pass on any errors to the error handler middleware.
    }
};
// deleteAllPosts = async (req, res, next) => {...};
