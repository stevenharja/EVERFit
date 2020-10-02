const factory = require('./handlerFactory');
const Section = require('../models/sectionModel');
const Program = require('../models/programModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllSection = factory.getAll(Section);
exports.getSection = factory.getOne(Section, { path: 'activity' });
exports.createSection = factory.createOne(Section);
// exports.updateSection = factory.updateOne(Section);
exports.updateSection = catchAsync(async (req, res, next) => {
  const sectionToCheck = await Section.findById(req.params.id);
  if (!sectionToCheck) {
    return next(new AppError('Document could not be found.', 404));
  }
  const program = await Program.findById(sectionToCheck.program);
  if (!program.user.equals(req.user.id) && req.user.role !== 'admin') {
    return next(
      new AppError('You are not allowed to update this section.', 401)
    );
  }
  const doc = await Section.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name, $push: { activity: req.body.activity } },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: 'success',
    data: {
      data: doc,
    },
  });
});
// exports.deleteSection = factory.deleteOne(Section);
exports.deleteSection = catchAsync(async (req, res, next) => {
  const sectionToCheck = await Section.findById(req.params.id);
  if (!sectionToCheck) {
    return next(new AppError('No document found with that ID', 404));
  }
  const program = await Program.findById(sectionToCheck.program);
  if (!program.user.equals(req.user.id) && req.user.role !== 'admin') {
    return next(
      new AppError('You are not allowed to update this section.', 401)
    );
  }
  await Section.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
