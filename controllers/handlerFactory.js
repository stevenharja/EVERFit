const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');
const multer = require('multer');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, callback) => {
  if (file.mimetype.startsWith('image')) {
    callback(null, true);
  } else {
    callback(
      new AppError('Not an image! Please upload only images.', 400),
      false
    );
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.deleteOne = (Model, onlyUser) =>
  catchAsync(async (req, res, next) => {
    //Allow admin to overwrite this rule.
    if (onlyUser && req.user.role !== 'admin') {
      req.params = { _id: req.params.id, user: req.user.id };
    } else {
      req.params = { _id: req.params.id };
    }
    const doc = await Model.findOneAndDelete(req.params);

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

//UpdateOne has onlyUser to prevent other user accessing documents that does not belong to them.
//Except for admin.
exports.updateOne = (Model, onlyUser) =>
  catchAsync(async (req, res, next) => {
    // Allow admin to overwrite this rule.
    if (onlyUser && req.user.role !== 'admin') {
      req.params = { _id: req.params.id, user: req.user.id };
    } else {
      req.params = { _id: req.params.id };
    }
    const doc = await Model.findOneAndUpdate(req.params, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    // Only specified user can create one, please look at routes for restrictions.
    if (req.user.id) req.body.user = req.user.id;
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.getOne = (Model, ...popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) {
      // query = query.populate(popOptions); Single populate
      popOptions.forEach((popOption) => {
        query = query.populate(popOption);
      });
    }
    const doc = await query;

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.programId) filter = { program: req.params.programId };
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    // const doc = await features.query.explain();
    const doc = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: {
        data: doc,
      },
    });
  });

exports.handleMultipartForm = upload.none();
