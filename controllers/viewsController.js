const Program = require('../models/programModel');
const Section = require('../models/sectionModel');
const Activity = require('../models/activityModel');
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

exports.getSignupForm = (req, res, next) => {
  res.status(200).render('signup', {
    title: 'Signup for an account now!',
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

exports.getEditContent = catchAsync(async (req, res, next) => {
  let Model;
  switch (req.params.model) {
    case 'programs':
      Model = Program;
      break;
    case 'sections':
      Model = Section;
      break;
    case 'activities':
      Model = Activity;
      break;
    default:
      return next(new AppError('This page does not exists', 404));
  }

  const doc = await Model.findById(req.params.id).populate({
    path: 'sections activity',
  });

  if (!doc) {
    return next(
      new AppError(`No ${req.params.model} was found with that name.`, 404)
    );
  }

  console.log(doc.sections);
  console.log(doc.activity);

  res.status(200).render('editContent', {
    title: `Edit ${doc.name}`,
    doc,
    model: req.params.model,
  });
});
