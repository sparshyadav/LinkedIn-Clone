import { json } from "express";
import Post from "../models/post.model.js";

export const getFeedPosts = async (req, res) => {
    try {
        const posts = await Post.find({ author: { $in: req.user.connections } })
            .populate("author", "name username profilePicture headline")
            .populate("comments.user", "name profilePicture")
            .sort({ createdAt: -1 });

        res.status(200).json(posts);
    }
    catch (error) {
        console.error("Error in getFeedPosts Controller: ", error);
        res.status(500).json({ message: "Server Error" });
    }
}

export const createPost = async (req, res) => {
    try {
        const { content, image } = req.body;

        let newPost;

        if (image) {
            const imgResult = await cloudinary.uploader.upload(image);

            newPost = new Post({
                author: req.user._id,
                content,
                image: imgResult.secure.url
            })
        }
        else {
            newPost = new Post({
                author: req.user._id,
                content,
            })
        }

        await newPost.save();

        res.status(200).json(newPost);
    }
    catch (error) {
        console.error("Error in createPost Controller: ", error);
        res.status(500).json({ message: "Server Error" });
    }
}

export const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user._id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post Not Found" });
        }

        if (post.author.toString() != userId.toString()) {
            return res.status(403).json({ message: "You are not Authorized to Delete this Post" });
        }

        await Post.findByIdAndDelete(postId);

        res.status(200).json({ message: "Post Deleted Successfully" });
    }
    catch (error) {
        console.error("Error in deletePost Controller: ", error);
        res.status(500).json({ message: "Server Error" });
    }
}