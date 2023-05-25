const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {User} = require("../models/user");
const {Post} = require("../models/post");
const {authenticateToken} = require("../middlewares/authenticate");
const router = express.Router();

// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find().select(['-password', '-_id', '-__v'])
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving users' });
    }
});

// Register new user
// User registration
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if the username is already occupied
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ error: 'Username is already taken' });
        }

        const saltRounds = 2;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const user = await User.create({ username, password: hashedPassword });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Error registering user' });
    }
});


// Login to user account
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        const token = jwt.sign({ userId: user._id }, 'secret_key');
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Error authenticating user' });
    }
});


// Update user
router.put('/', authenticateToken, async (req, res) => {
    try {
        const { username } = req.body;

        // Find the logged-in user
        const loggedInUser = await User.findById(req.user.userId);

        if (!loggedInUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if the new username is already occupied
        const existingUser = await User.findOne({ username: username });
        if (existingUser && existingUser._id.toString() !== loggedInUser._id.toString()) {
            return res.status(409).json({ error: 'Username is already taken' });
        }

        // Update the username
        loggedInUser.username = username;
        const updatedUser = await loggedInUser.save();

        res.json(updatedUser);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Error updating user' });
    }
});


module.exports = {usersRouter: router};