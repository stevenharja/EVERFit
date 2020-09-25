//Activity refers to the activity that is required in a section. (Jumping jacks, or drinking smoothie)
//Order refers to the order in the section that the activity is in.
const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'An activity must have a name provided'],
    trim: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'An activity must be created by a user.'],
  },
  description: {
    type: String,
    required: [true, 'An activity must have a description'],
  },
  media: {
    type: String,
    required: [true, 'An activity must have an image or video referenced.'],
  },
  summary: {
    type: String,
    required: [true, 'An activity must have a summary.'],
  },
  order: Number,
});

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;
