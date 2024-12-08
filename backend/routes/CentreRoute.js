const express = require('express');
const Centre = require('../models/Centres');
const router = express.Router();
const {authenticate, authorizeAdmin, authorizeUser} = require('./Jwtauth')

router.get('/', async (req, res) => {
    try {
        const centers = await Centre.find();
        res.status(200).json(centers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const center = await Centre.findById(req.params.id);
        if (!center) {
            return res.status(404).json({ message: 'Centre not found' });
        }
        res.status(200).json(center);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.post('/', async (req, res) => {
    try {
        const center = new Centre(req.body);
        await center.save();
        res.status(201).json(center);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


router.put('/:id', authenticate, authorizeAdmin, async (req, res) => {
    try {
        const centre = await Centre.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!centre) return res.status(404).json({ error: 'Centre not found' });
        res.status(200).json(centre);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete('/:id', authenticate, authorizeAdmin, async (req, res) => {
    try {
        const center = await Center.findByIdAndDelete(req.params.id);
        if (!center) return res.status(404).json({ error: 'Center not found' });
        res.status(200).json({ message: 'Center deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;