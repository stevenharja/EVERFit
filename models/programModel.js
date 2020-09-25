const mongoose = require('mongoose');
const slugify = require('slugify');

const programSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A program must have a name'],
      unique: true,
      trim: true,
      minlength: [10, 'A program name must have at least 10 characters'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A program must be created by a user.'],
    },
    slug: String,
    description: {
      type: String,
      trim: true,
      required: [true, 'A program must have a description'],
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A program must have a summary'],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: (val) => Math.round(val * 10) / 10, // 4.666666, 46.6666, 47, 4.7
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    imageCover: {
      type: String,
      required: [true, 'A program must have an image cover.'],
    },
    category: {
      type: String,
      enum: ['workout', 'diet', 'mindfulness'],
      required: true,
    },
    createdAt: { type: Date, default: Date.now(), select: false },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

programSchema.index({ ratingsAverage: -1 });
programSchema.index({ slug: 1 });

//Connect between the programs and reviews and sections.
//Where foreignField is the attribute name in the review model
//While localField is where the id is in this model.
programSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'program',
  localField: '_id',
});

programSchema.virtual('sections', {
  ref: 'Section',
  foreignField: 'program',
  localField: '_id',
});

//DOCUMENT MIDDLEWARE
programSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const Program = mongoose.model('Program', programSchema);

module.exports = Program;
