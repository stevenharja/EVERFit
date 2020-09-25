//Section defines a section of a program, it refers to multiple items of activities (ex: jumping jacks or drink smoothie, etc.)
const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A section must have a name provided'],
      trim: true,
    },
    program: {
      type: mongoose.Schema.ObjectId,
      ref: 'Program',
      required: [true, 'A section must belong to a program.'],
    },
    activity: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Activity',
      },
    ],
    order: Number,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Populate the section with the activities that are associated to it.
sectionSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'activity',
    select: 'name summary media order',
  });
  next();
});

const Section = mongoose.model('Section', sectionSchema);

module.exports = Section;
