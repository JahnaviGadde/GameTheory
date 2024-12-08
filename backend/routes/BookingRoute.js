const express = require('express');
const Booking = require('../models/Bookings');
const User = require('../models/Users');
const router = express.Router();
const {authenticate, authorizeAdmin, authorizeUser} = require('./Jwtauth')

router.get('/', async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('userId centerId courtId sportId')
            .sort({ date: -1 });
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('userId centerId courtId sportId');
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.status(200).json(booking);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/user/:userId', async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.params.userId })
            .populate('userId centerId courtId sportId');
       
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.get('/court/:courtId/date/:date', async (req, res) => {
    try {
        const { courtId, date } = req.params;

        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const bookings = await Booking.find({
            courtId,
            date: { $gte: startOfDay, $lte: endOfDay }
        }).populate('userId centerId courtId sportId');

        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', authenticate,authorizeAdmin, async (req, res) => {
    try {
      const { courtId, date, bookingSlot } = req.body;
  
      const existingBooking = await Booking.findOne({ courtId, date, bookingSlot });
      if (existingBooking) {
        return res.status(200).json({ message: 'The selected slot is already booked.' });
      }

      const booking = new Booking(req.body);
      await booking.save();

      res.status(201).json(booking);

    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  

router.put('/:id', authenticate, authorizeAdmin, async (req, res) => {
    try {
        const updatedBooking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedBooking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.status(200).json(updatedBooking);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.put('/book/:id', authenticate, authorizeUser, async (req, res) => {
    try {
        const { userId, customername } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required to book a slot." });
        }

        const userExists = await User.findById(userId);
        if (!userExists) {
            return res.status(403).json({ message: "Invalid user. User does not exist." });
        }

        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found.' });
        }

        if (booking.bookingStatus === 'booked') {
            return res.status(400).json({ message: 'Slot already booked.' });
        }

        booking.bookingStatus = 'booked';
        booking.userId = userId;
        booking.customerName = customername;

        await booking.save();

        res.status(200).json({ message: 'Slot successfully booked.', booking });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/unbook/:id', authenticate, authorizeUser, async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required to unbook a slot." });
        }

        const userExists = await User.findById(userId);
        if (!userExists) {
            return res.status(403).json({ message: "Invalid user. User does not exist." });
        }

        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found.' });
        }

        if (booking.bookingStatus === 'empty') {
            return res.status(400).json({ message: 'Slot already unbooked.' });
        }

        if (booking.userId.toString() !== userId) {
            return res.status(403).json({ message: 'You can only unbook your own reservation.' });
        }

        booking.bookingStatus = 'empty';
        booking.userId = null; 
        booking.customerName = null; 
        await booking.save();

        res.status(200).json({ message: 'Slot successfully unbooked.', booking });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.delete('/:id',authenticate, authorizeAdmin, async (req, res) => {
    try {
        const deletedBooking = await Booking.findByIdAndDelete(req.params.id);
        if (!deletedBooking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.status(200).json({ message: 'Booking cancelled successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
