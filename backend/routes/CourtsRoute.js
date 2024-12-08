const express = require('express');
const Court = require('../models/Courts');
const router = express.Router();
const {authenticate, authorizeAdmin, authorizeUser} = require('./Jwtauth')

router.get('/', async (req, res) => {
    try {
        const courts = await Court.find().populate('centerId sportId');
        res.status(200).json(courts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/center/:centerId', async (req, res) => {
    try {
        const courts = await Court.find({ centerId: req.params.centerId }).populate('centerId sportId');
        if (!courts || courts.length === 0) {
            return res.status(404).json({ message: 'No courts found for this center' });
        }
        res.status(200).json(courts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const court = new Court(req.body);
        await court.save();
        res.status(201).json(court);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const court = await Court.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!court) {
            return res.status(404).json({ message: 'Court not found' });
        }
        res.status(200).json(court);
    } catch (error) {

        res.status(400).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const court = await Court.findByIdAndDelete(req.params.id);
        if (!court) {
            return res.status(404).json({ message: 'Court not found' });
        }
        res.status(200).json({ message: 'Court deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
