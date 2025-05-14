const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
    if (req.session.userId) {
        return next();
    }
    res.redirect('/login');
};

// Register new user
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const user = new User({ name, email, password, role });
        await user.save();
        req.session.userId = user._id;
        res.redirect('/dashboard');
    } catch (error) {
        res.status(400).render('register', { error: error.message });
    }
});

// Login user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).render('login', { error: 'Invalid credentials' });
        }

        req.session.userId = user._id;
        res.redirect('/dashboard');
    } catch (error) {
        res.status(400).render('login', { error: error.message });
    }
});

// Logout user
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

// Get user profile
router.get('/profile', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.session.userId);
        res.render('profile', { user });
    } catch (error) {
        res.status(500).render('error', { error: error.message });
    }
});

// Update user profile
router.put('/profile', isAuthenticated, async (req, res) => {
    try {
        const { name, email, phone, address } = req.body;
        const user = await User.findByIdAndUpdate(
            req.session.userId,
            { name, email, phone, address },
            { new: true }
        );
        res.json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router; 