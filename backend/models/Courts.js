const mongoose = require('mongoose');

const courtSchema = new mongoose.Schema({

    name: { type: String, required: true , unique : true}, 
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
});

module.exports = mongoose.model('Court', courtSchema);
