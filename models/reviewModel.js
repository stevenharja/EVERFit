//Review defines a review created by user to a certain program.
const mongoose = require('mongoose');
const Program = require('./programModel');

const reviewSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: [true, 'A review must have a description'],
      trim: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    program: {
      type: mongoose.Schema.ObjectId,
      ref: 'Program',
      required: [true, 'A review must belong to a program'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.index({ program: 1, user: 1 }, { unique: true });

//Populate the results with the user connected with the review
//But only retrieve the name and photo attribute of the user
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

reviewSchema.statics.calcAverageRatings = async function (programId) {
  const stats = await this.aggregate([
    {
      $match: { program: programId },
    },
    {
      $group: {
        _id: '$program',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  // console.log(stats);

  if (stats.length > 0) {
    await Program.findByIdAndUpdate(programId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Program.findByIdAndUpdate(programId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

reviewSchema.post('save', function () {
  // this points to current review
  this.constructor.calcAverageRatings(this.program);
});

//Start of calculating averageOne after modifying or deleting reviews of the program affected.
// findByIdAndUpdate
// findByIdAndDelete
// Stores the review that was being found.
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne();
  // console.log(this.r);
  next();
});

//Modifies the program with the associated reviews based on what was modified.
reviewSchema.post(/^findOneAnd/, async function () {
  // await this.findOne(); does NOT work here, query has already executed
  //Check if it exists, user might be trying to modify a document that they do not own.
  if (this.r) {
    await this.r.constructor.calcAverageRatings(this.r.program);
  }
});

//End of calculating averageOne after modifying or deleteing reviews of the program affected

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
