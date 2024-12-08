const express = require('express');
const Sport = require('../models/Sports');
const router = express.Router();
const {authenticate, authorizeAdmin} = require('./Jwtauth')

router.get('/', async (req, res) => {
    try {
        const sports = await Sport.find();
        res.status(200).json(sports);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const sport = await Sport.findById(req.params.id);
        if (!sport) {
            return res.status(404).json({ message: 'Sport not found' });
        }
        res.status(200).json(sport);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
      const sport = new Sport(req.body);
      await sport.save();
      res.status(201).json(sport);
    } catch (error) {
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0]; 
        res.status(400).json({ error: `The ${field} must be unique. Duplicate value found.` });
      } else {
        // General error
        res.status(400).json({ error: error.message });
      }
    }
  });
  

router.put('/:id',async (req, res) => {
    try {
        const sport = await Sport.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!sport) {
            return res.status(404).json({ message: 'Sport not found' });
        }
        res.status(200).json(sport);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const sport = await Sport.findByIdAndDelete(req.params.id);
        if (!sport) {
            return res.status(404).json({ message: 'Sport not found' });
        }
        res.status(200).json({ message: 'Sport deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
