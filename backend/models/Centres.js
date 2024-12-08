const mongoose = require('mongoose');

const centerSchema = new mongoose.Schema({

    name: { type: String, required: true , unique : true},
    location: { type: String, required: true },
    city: { type: String, required: true }, 
    pincode: { type: String, required: true }, 
    
}, { timestamps: true });

module.exports = mongoose.model('Centre', centerSchema);
