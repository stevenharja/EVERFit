const Program = require('../models/programModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res, next) => {
  const programs = await Program.find().populate({ path: 'user' });
  // Returns in a form of array.
  let topProgram = await Program.find()
    .sort({ ratingsAverage: -1 })
    .limit(1)
    .populate({ path: 'user reviews' });
  topProgram = topProgram[0];
  res.status(200).render('overview', {
    title: 'Our Programs',
    programs,
    topProgram,
  });
});

exports.getLoginForm = (req, res, next) => {
  res.status(200).render('login', {
    title: 'Log into your account',
  });
};

exports.getAccount = (req, res, next) => {
  res.status(200).render('profile', {
    title: 'Your account',
  });
};

exports.getProgram = catchAsync(async (req, res, next) => {
  const program = await Program.findOne({ slug: req.params.slug }).populate({
    path: 'user reviews sections',
  });

  if (!program) {
    return next(new AppError('No program was found with that name.', 404));
  }

  res.status(200).render('program', {
    title: program.name,
    program,
  });
});

exports.getCategoryProgram = catchAsync(async (req, res, next) => {
  const programs = await Program.find({
    category: req.params.category,
  }).populate({ path: 'user' });

  let topProgram = await Program.find({ category: req.params.category })
    .sort({ ratingsAverage: -1 })
    .limit(1)
    .populate({ path: 'user reviews' });
  topProgram = topProgram[0];
  res.status(200).render('category', {
    title: `${req.params.category} programs`,
    programs,
    topProgram,
    category: req.params.category,
  });
});
