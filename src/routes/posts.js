const express = require("express");
const {authenticateToken} = require("../middlewares/authenticate");
const {Post} = require("../models/post");
const {User} = require("../models/user");

const router = express.Router();

// Create a new post
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { header, text } = req.body;
        const post = await Post.create({ header, text, user: req.user.userId });
        res.json(post);
    } catch (error) {
        res.status(500).json({ error: 'Error creating post' });
    }
});

// Read all posts
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().populate('user');
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving posts' });
    }
});

// Update a post
router.put('/:postId', authenticateToken, async (req, res) => {
    try {
        const { postId } = req.params;
        const { header, text } = req.body;
        const updatedPost = await Post.findOneAndUpdate(
            { postId, user: req.user._id },
            { $set: { header, text } },
            { new: true }
        );
        if (!updatedPost) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.json(updatedPost);
    } catch (error) {
        res.status(500).json({ error: 'Error updating post' });
    }
});

// Delete a post
router.delete('/:postId', authenticateToken, async (req, res) => {
    try {
        const { postId } = req.params;
        const deletedPost = await Post.findOneAndRemove({ postId, user: req.user._id });
        if (!deletedPost) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting post' });
    }
});

// All posts from user
router.get('/user/:username', async (req, res) => {
    try {
        const { username } = req.params;

        // Find the user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Find all posts by the user
        const posts = await Post.find({ user: user._id }).populate('user');
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving user posts' });
    }
});

module.exports = {postsRouter: router}