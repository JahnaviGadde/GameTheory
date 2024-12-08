const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    
    customerName: { type: String, required: false },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: false
    }, 
    centerId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Centre', 
        required: true 
    },
    sportId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Sport', 
        required: true 
    },
    courtId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Court', 
        required: true 
    },
    bookingSlot: {
        type: String,
        enum: ['5:00 AM - 6:00 AM','6:00 AM - 7:00 AM', '7:00 AM - 8:00 AM', '8:00 AM - 9:00 AM', '9:00 AM - 10:00 AM', '10:00 AM - 11:00 AM', 
               '11:00 AM - 12:00 PM', '12:00 PM - 1:00 PM', '1:00 PM - 2:00 PM', '2:00 PM - 3:00 PM', '3:00 PM - 4:00 PM',
               '4:00 PM - 5:00 PM', '5:00 PM - 6:00 PM', '6:00 PM - 7:00 PM', '7:00 PM - 8:00 PM', '8:00 PM - 9:00 PM', '9:00 PM - 10:00 PM', '10:00 PM - 11:00 PM', '11:00 PM - 12:00 AM'],
        required: true, 
    },
    date: {
        type: Date, 
        required: true, 
    },
    bookingStatus: {
        type: String,
        enum: ['booked', 'empty',],
        default: 'empty',
    },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
