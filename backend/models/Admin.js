const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    
    email: {type : String, required: true ,unique: true },
    password: { type: String, required: true },
    centerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Centre',
        required : false
    }
}, { timestamps: true });

module.exports = mongoose.model('Admin', adminSchema);
