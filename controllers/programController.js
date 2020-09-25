const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const Program = require('../models/programModel');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

//Get programs based on their category.
//Also sort them by ratings.
exports.getProgramCategories = catchAsync(async (req, res, next) => {
  req.query.sort = '-ratingsAverage';
  const features = new APIFeatures(
    Program.find({ category: req.params.category }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const programs = await features.query;
  if (programs.length === 0) {
    return next(new AppError('No program was found with that category.', 404));
  }

  //Else send response
  res.status(200).json({
    status: 'success',
    results: programs.length,
    data: {
      data: programs,
    },
  });
});

//Factory Based Operations
exports.getAllProgram = factory.getAll(Program);
exports.getProgram = factory.getOne(
  Program,
  { path: 'reviews' },
  { path: 'sections' }
);
exports.createProgram = factory.createOne(Program);
exports.updateProgram = factory.updateOne(Program, true);
exports.deleteProgram = factory.deleteOne(Program, true);
