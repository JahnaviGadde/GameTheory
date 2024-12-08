const express = require('express');
const User = require('../models/Users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

router.post('/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existiUser = await User.findOne({ username });
        if (existiUser) return res.status(400).json({ message: 'Username already exists.' });

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists.' });
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'User signed up successfully.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid email or password.' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid email or password.' });

        const token = jwt.sign({ id: user._id, role: 'user' }, JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            token,
            user: {
              id: user._id,
              email: user.email,
              name: user.username,
            }
          });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
