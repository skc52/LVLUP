const Motivation = require("../models/postModel.js");
const User = require("../models/userModel.js");
const ErrorHandler = require("../utils/errorHandler.js");

// create a post
exports.createAPost = async(req, res, next)=>{
    try{
        const user = await User.findById(req.user.id);
        
        const post = await Motivation.create({
            creatorId:user.id,
            ...req.body
        })

        res.status(200).json({
            success:true,
            post,
            message:"Post created successfully!"
        })
    } 
    catch(error){
        next(new ErrorHandler(error.message));
    }
}

// update a post
exports.updateAPost = async(req, res, next)=>{
    try{
        console.log("UPDATING THE POST")
        let post = await Motivation.findById(req.params.postId);
        if (!post){
            return next(new ErrorHandler(`Post not found`));
        }

        // check if the post is created by the requesting user
        if (post.creatorId.toString() !== req.user.id){
            return next(new ErrorHandler(`User not allowed to update this post`));    
        }

        post = await Motivation.findByIdAndUpdate(req.params.postId, req.body,{
            new:true,
            runValidators:true,
            useFindAndModify:false,
        });

        res.status(200).json({
            success:true,
            message:`Post updated`,
            post
        });
    } 
    catch(error){
        next(new ErrorHandler(error.message));
    }
}
// delete a post
exports.deleteAPost = async(req, res, next)=>{
    try{
        const post = await Motivation.findById(req.params.postId);
        if (!post){
            return next(new ErrorHandler(`Post not found`));
        }

        // check if the post is created by the requesting user
        if (post.creatorId.toString() !== req.user.id){
            return next(new ErrorHandler(`User not allowed to delete this post`));    
        }

        // TODO: we will remove cloudinary 

        await post.remove();
        res.status(200).json({
            success:true,
            message:"Post deleted successfully!"
        });
    
    } 
    catch(error){
        next(new ErrorHandler(error.message));
    }
}
// like a post - unlike too if already liked the post
exports.likeAPost = async(req, res, next)=>{
    try{
        console.log("LIKING A POST")
        const user = await User.findById(req.user.id);
        let post = await Motivation.findById(req.params.postId).populate("creatorId");
        if (!post){
            return next(new ErrorHandler(`Post not found`));
        }

        //unlike if already liked
        if (post.likes.includes(user.id)){
            post.likes = post.likes.filter((like, id)=>{
                return like.toString() !== req.user.id
            })
        }
        // like if not liked
        else{
            post.likes.push(user.id);
        }

        await post.save();
        res.status(200).json({
            success:true,
            post,
            message:"Like Toggled for this post"
        })



    } 
    catch(error){
        next(error.message);
    }
}

exports.addComment = async (req, res, next) => {
    try {
        console.log("adding a comment")
        const {postId} = req.params;
      const {  comment } = req.body;
      const user = await User.findById(req.user.id);

  
      const post = await Motivation.findById(postId).populate("creatorId");
  
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      const newComment = {
        postId,
        creatorId:user._id,
        creatorName:user.name,
        creatorAvatar:user.avatar.url,
        comment,
        commentedAt: new Date(),
        edited: false,
      };
      
      post.comments.push(newComment);
      
  
      await post.save();

      console.log(newComment)
  
      res.status(201).json(
        { message: 'Comment added',
         comment: newComment,
         post
        
        });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  };
// get a post
// This will be for a section called Motivation From around the globe
exports.getAllPosts = async(req, res, next)=>{
    try{
        console.log("HERE IN POSTS CONTROLLER")
        const posts = await Motivation.find().populate("creatorId").sort("-createdAt");
        res.status(200).json({
            success:true,
            posts,

        })       
    } 
    catch(error){
        next(new ErrorHandler(error.message));
    }
}

// get likes
exports.getAllLikesForAPost = async(req, res, next)=>{
    try{
        const post = await Motivation.findById(req.params.postId);
        if (!post){
            return next(new ErrorHandler(`Post not found`));
        }
        const likes = post.likes;
        res.status(200).json({
            success:true,
            likes
        })
    } 
    catch(error){
        next(new ErrorHandler(error.message));
    }
}


exports.getAPost = async(req, res, next)=>{
    try{
        const post = await Motivation.findById(req.params.postId);
        if(!post){
            return next(new ErrorHandler(`Post not found`));    
        }
        res.status(200).json({
            success:true,
            post
        })

    } 
    catch(error){
        next(new ErrorHandler(error.message));
    }
}

// TODO : get all posts from the people you follow
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


//TODO:  get my posts
exports.getMyPosts = async(req, res, next) =>{
    try {
        const user = await User.findById(req.user.id);
        const posts = await Motivation.find({
            creatorId:user.id
        })
        res.status(200).json({
            success:true,
            posts
        })

    } catch (error) {
        next(new ErrorHandler(error.message));
  
    }
}


exports.getUserPosts = async(req, res, next) =>{
    try {
        const {userId} = req.params;
        const user = await User.findById(userId);
        console.log("GET USERS POSTS")
        const posts = await Motivation.find({
            creatorId:user.id

        }).populate("creatorId").sort("-createdAt");
        res.status(200).json({
            success:true,
            posts,

        })   
        

    } catch (error) {
        next(new ErrorHandler(error.message));
  
    }
}




// DELETE ALL MESSAGES - ADMIN
exports.deleteAllPosts = async (req, res, next) => {
    try {
      await Motivation.deleteMany({});
      res.status(200).json({ success: true, message: 'All posts have been deleted.' });
    } catch (err) {
      next(err);
    }
  };