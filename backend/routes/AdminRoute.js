const express = require('express');
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Admin Signup
router.post('/signup', async (req, res) => {
    try {
        const { centerId, email, password } = req.body;

        const existingCentre = await Admin.findOne({centerId});
        if(existingCentre) return res.status(400).json({message: 'Admin for this centre already exists.'})

        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) return res.status(400).json({ message: 'Admin already exists.' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newAdmin = new Admin({ centerId , email, password: hashedPassword });
        await newAdmin.save();

        res.status(201).json({ message: 'Admin signed up successfully.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Admin Signin
router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;

        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        const token = jwt.sign( { id: admin._id, role: 'admin' }, JWT_SECRET,{ expiresIn: '1h' });

        res.status(200).json({
            token,
            centerId: admin.centerId, 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
