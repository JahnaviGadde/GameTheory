const mongoose = require('mongoose');

const sportSchema = new mongoose.Schema({
  name: {
    type: String,
    enum: [
      'Badminton',
      'Squash',
      'Tennis',
      'Football',
      'Basketball',
      'Cricket',
      'Volleyball',
      'Table Tennis',
      'Swimming',
      'Others',
    ],
    required: true,
    unique:true
  },
  otherSportName: {
    type: String,
    required: function () {
      return this.name === 'Others';
    },
    validate: {
      validator: function (v) {
        return this.name !== 'Others' || (v && v.length > 0);
      },
      message: 'Please specify the name of the sport if "Others" is selected.',
    },
    unique:false
  },
}, { timestamps: true });

module.exports = mongoose.model('Sport', sportSchema);
