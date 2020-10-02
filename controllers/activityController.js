const factory = require('./handlerFactory');
const Activity = require('../models/activityModel');
const multer = require('multer');
const sharp = require('sharp');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, callback) => {
  if (file.mimetype.startsWith('image')) {
    callback(null, true);
  } else {
    callback(
      new AppError('Not an image, please upload only images!', 400),
      false
    );
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadActivityImage = upload.single('imageCover');

exports.resizeActivityImage = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  req.body.media = `activity-${req.params.id}-${Date.now()}-image.jpeg`;
  await sharp(req.file.buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/activities/${req.body.media}`);

  next();
});

//CRUD Operations
exports.getAllActivity = factory.getAll(Activity);
exports.getActivity = factory.getOne(Activity);
exports.createActivity = factory.createOne(Activity);
exports.updateActivity = factory.updateOne(Activity, true);
exports.deleteActivity = factory.deleteOne(Activity, true);
