const factory = require('./handlerFactory');
const Activity = require('../models/activityModel');

//CRUD Operations
exports.getAllActivity = factory.getAll(Activity);
exports.getActivity = factory.getOne(Activity);
exports.createActivity = factory.createOne(Activity);
exports.updateActivity = factory.updateOne(Activity, true);
exports.deleteActivity = factory.deleteOne(Activity, true);
