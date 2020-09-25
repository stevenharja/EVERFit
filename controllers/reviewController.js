const factory = require('./handlerFactory');
const Review = require('../models/reviewModel');

//Middleware for creating review from logged in user.
exports.setProgramReviewIds = (req, res, next) => {
  if (!req.body.program) req.body.program = req.params.programId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllReview = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review, true);
exports.deleteReview = factory.deleteOne(Review, true);
